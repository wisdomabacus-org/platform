import { useState, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Upload, FileSpreadsheet, Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { Question, QuestionOption } from '../types/question-bank.types';
import { generateOptions } from '../utils/question-generator';
import { toast } from 'sonner';

interface CSVImportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onImport: (questions: Partial<Question>[]) => void;
    isImporting?: boolean;
}

interface ParsedRow {
    questionNo: number;
    operations: number[];
    correctAnswer: number;
    options: QuestionOption[];
    correctOptionIndex: number;
    operatorType: 'addition' | 'subtraction' | 'mixed' | 'multiplication' | 'division';
    valid: boolean;
    error?: string;
}

/**
 * Parse a single cell value into a number with its operator.
 * Formats:
 *   "5" or "+5"   → 5 (addition)
 *   "-3"          → -3 (subtraction)
 *   "x4" or "×4"  → treated as multiplication indicator, stored as raw 4
 *   "/8" or "÷8"  → treated as division indicator, stored as raw 8
 *
 * For abacus-style questions (addition/subtraction/mixed):
 *   - The number is stored with its sign in operations[]
 *   - e.g. [15, -3, 8] means 15 - 3 + 8 = 20
 */
function parseOperationCell(cell: string): { value: number; opType: 'add' | 'sub' | 'mul' | 'div' } {
    const trimmed = String(cell).trim();
    if (!trimmed) return { value: 0, opType: 'add' };

    // Multiplication: x, ×, or *
    if (/^[x×*]/i.test(trimmed)) {
        const num = parseFloat(trimmed.slice(1).trim());
        return { value: isNaN(num) ? 0 : num, opType: 'mul' };
    }

    // Division: /, ÷
    if (/^[÷/]/.test(trimmed)) {
        const num = parseFloat(trimmed.slice(1).trim());
        return { value: isNaN(num) ? 0 : num, opType: 'div' };
    }

    // Subtraction: leading minus (but allow negative numbers)
    if (/^-/.test(trimmed)) {
        const num = parseFloat(trimmed);
        return { value: isNaN(num) ? 0 : num, opType: 'sub' };
    }

    // Addition: plain number or leading +
    const cleaned = trimmed.replace(/^\+/, '');
    const num = parseFloat(cleaned);
    return { value: isNaN(num) ? 0 : num, opType: 'add' };
}

function detectOperatorType(ops: { opType: string }[]): 'addition' | 'subtraction' | 'mixed' | 'multiplication' | 'division' {
    const types = new Set(ops.map(o => o.opType));
    if (types.has('mul')) return 'multiplication';
    if (types.has('div')) return 'division';
    if (types.has('sub') && types.has('add')) return 'mixed';
    if (types.has('sub')) return 'subtraction';
    return 'addition';
}

function computeAnswer(ops: { value: number; opType: string }[]): number {
    if (ops.length === 0) return 0;

    const firstOp = ops[0];
    let result = firstOp.value;

    for (let i = 1; i < ops.length; i++) {
        const { value, opType } = ops[i];
        switch (opType) {
            case 'mul': result *= value; break;
            case 'div': result = value !== 0 ? result / value : result; break;
            case 'sub': result += value; break; // value is already negative
            default: result += value; break;
        }
    }
    return Math.round(result * 100) / 100; // Avoid floating point issues
}

function parseSheet(data: any[][]): ParsedRow[] {
    const rows: ParsedRow[] = [];

    for (let r = 0; r < data.length; r++) {
        const row = data[r];
        if (!row || row.length < 2) continue;

        // First column: question number
        const qNo = parseInt(String(row[0]));
        if (isNaN(qNo)) continue; // Skip header or invalid rows

        // Remaining columns: operations
        const parsedOps: { value: number; opType: string }[] = [];
        for (let c = 1; c < row.length; c++) {
            const cellVal = row[c];
            if (cellVal === undefined || cellVal === null || String(cellVal).trim() === '') continue;
            parsedOps.push(parseOperationCell(String(cellVal)));
        }

        if (parsedOps.length < 2) {
            rows.push({
                questionNo: qNo,
                operations: [],
                correctAnswer: 0,
                options: [],
                correctOptionIndex: 0,
                operatorType: 'addition',
                valid: false,
                error: 'Need at least 2 operations',
            });
            continue;
        }

        const operatorType = detectOperatorType(parsedOps);
        const operations = parsedOps.map(o => o.value);
        const correctAnswer = computeAnswer(parsedOps);

        if (correctAnswer <= 0) {
            rows.push({
                questionNo: qNo,
                operations,
                correctAnswer,
                options: [],
                correctOptionIndex: 0,
                operatorType,
                valid: false,
                error: `Answer is ${correctAnswer} (must be positive)`,
            });
            continue;
        }

        const options = generateOptions(correctAnswer, 20);
        const correctIndex = options.findIndex(o => parseInt(o.text) === correctAnswer);

        rows.push({
            questionNo: qNo,
            operations,
            correctAnswer,
            options,
            correctOptionIndex: correctIndex >= 0 ? correctIndex : 0,
            operatorType,
            valid: true,
        });
    }

    return rows;
}

export function CSVImportModal({ open, onOpenChange, onImport, isImporting }: CSVImportModalProps) {
    const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                // Skip header row if first cell looks like a label
                const startRow = (typeof jsonData[0]?.[0] === 'string' && isNaN(parseInt(jsonData[0][0]))) ? 1 : 0;
                const dataRows = jsonData.slice(startRow);

                const parsed = parseSheet(dataRows);
                setParsedRows(parsed);

                if (parsed.length === 0) {
                    toast.error('No valid questions found in file');
                } else {
                    const validCount = parsed.filter(r => r.valid).length;
                    const invalidCount = parsed.filter(r => !r.valid).length;
                    toast.success(`Parsed ${validCount} questions${invalidCount > 0 ? ` (${invalidCount} invalid)` : ''}`);
                }
            } catch (err) {
                console.error('Parse error:', err);
                toast.error('Failed to parse file. Please check the format.');
            }
        };

        reader.readAsArrayBuffer(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const validRows = parsedRows.filter(r => r.valid);
    const invalidRows = parsedRows.filter(r => !r.valid);

    const handleImport = () => {
        const questions: Partial<Question>[] = validRows.map((row, idx) => ({
            type: 'abacus' as const,
            operatorType: row.operatorType,
            operations: row.operations,
            correctAnswer: row.correctAnswer,
            options: row.options,
            correctOptionIndex: row.correctOptionIndex,
            digits: Math.max(...row.operations.map(Math.abs)).toString().length,
            rowsCount: row.operations.length,
            marks: 1,
            isAutoGenerated: false,
            sortOrder: idx,
        }));

        onImport(questions);
    };

    const handleClear = () => {
        setParsedRows([]);
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleClear(); onOpenChange(v); }}>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Import Questions from CSV / Excel</DialogTitle>
                    <DialogDescription>
                        Upload a file with columns: <strong>Q.No</strong>, <strong>Op 1</strong>, <strong>Op 2</strong>, <strong>Op 3</strong>...
                        Use prefixes for operations: <code>-3</code> (subtract), <code>x4</code> (multiply), <code>/2</code> (divide).
                        Plain numbers or <code>+5</code> means addition.
                    </DialogDescription>
                </DialogHeader>

                {parsedRows.length === 0 ? (
                    /* Upload Area */
                    <div
                        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 transition-colors cursor-pointer ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm font-medium">Drop your CSV or Excel file here</p>
                        <p className="text-xs text-muted-foreground mt-1">Supports .csv, .xlsx, .xls</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                            onChange={handleFileInput}
                        />
                    </div>
                ) : (
                    /* Preview Area */
                    <div className="flex-1 overflow-hidden flex flex-col gap-3">
                        {/* File Info */}
                        <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-2">
                            <div className="flex items-center gap-2">
                                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium">{fileName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                    <CheckCircle2 className="h-3 w-3 inline mr-1 text-green-600" />
                                    {validRows.length} valid
                                    {invalidRows.length > 0 && (
                                        <span className="ml-2 text-destructive">
                                            <AlertCircle className="h-3 w-3 inline mr-1" />
                                            {invalidRows.length} invalid
                                        </span>
                                    )}
                                </span>
                                <Button variant="ghost" size="sm" onClick={handleClear} className="h-7 gap-1 text-xs">
                                    <Trash2 className="h-3 w-3" /> Clear
                                </Button>
                            </div>
                        </div>

                        {/* Table Preview */}
                        <div className="flex-1 overflow-auto rounded-lg border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Q#</th>
                                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Operations</th>
                                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Type</th>
                                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Answer</th>
                                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Options</th>
                                        <th className="px-3 py-2 text-center font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedRows.map((row, i) => (
                                        <tr key={i} className={`border-t ${!row.valid ? 'bg-destructive/5' : 'hover:bg-muted/20'}`}>
                                            <td className="px-3 py-2 font-mono text-xs">{row.questionNo}</td>
                                            <td className="px-3 py-2 font-mono text-xs">
                                                {row.operations.map((op, idx) => (
                                                    <span key={idx} className={op < 0 ? 'text-red-500' : 'text-green-600'}>
                                                        {idx > 0 ? ', ' : ''}{op >= 0 ? `+${op}` : `${op}`}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="px-3 py-2">
                                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize">{row.operatorType}</span>
                                            </td>
                                            <td className="px-3 py-2 text-right font-bold font-mono">{row.correctAnswer}</td>
                                            <td className="px-3 py-2 text-xs text-muted-foreground">
                                                {row.valid ? row.options.map(o => o.text).join(', ') : '—'}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                {row.valid ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                                                ) : (
                                                    <span className="text-xs text-destructive" title={row.error}>
                                                        <AlertCircle className="h-4 w-4 mx-auto" />
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => { handleClear(); onOpenChange(false); }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={validRows.length === 0 || isImporting}
                        className="gap-2"
                    >
                        {isImporting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        Import {validRows.length} Question{validRows.length !== 1 ? 's' : ''}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
