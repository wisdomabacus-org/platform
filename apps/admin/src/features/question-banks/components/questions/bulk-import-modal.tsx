
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { Loader2, AlertCircle } from 'lucide-react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onImport: (questions: any[]) => void;
    isLoading: boolean;
}

export function BulkImportModal({ open, onOpenChange, onImport, isLoading }: Props) {
    const [csvContent, setCsvContent] = useState('');
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleParse = () => {
        setError(null);
        try {
            const rows = csvContent.trim().split('\n');
            if (rows.length < 2) {
                throw new Error('CSV must have a header row and at least one data row.');
            }

            // Simple CSV parser
            const data = rows.slice(1).map((row, index) => {
                const cols = row.split(',').map(c => c.trim());

                if (cols.length < 7) {
                    // check required fields
                }

                const text = cols[0];
                const marks = parseInt(cols[1]) || 1;
                const opts = [cols[2], cols[3], cols[4], cols[5]].filter(o => o); // remove empty
                const correctIndex = parseInt(cols[6]) - 1; // 1-based to 0-based
                const imageUrl = cols[7] || '';

                if (!text) throw new Error(`Row ${index + 2}: Question text missing`);
                if (opts.length < 2) throw new Error(`Row ${index + 2}: At least 2 options required`);
                if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= opts.length) {
                    throw new Error(`Row ${index + 2}: Invalid correct option index (must be 1-${opts.length})`);
                }

                return {
                    text,
                    marks,
                    imageUrl,
                    options: opts.map(o => ({ text: o })),
                    correctOptionIndex: correctIndex
                };
            });

            setParsedData(data);
        } catch (e: any) {
            setError(e.message);
            setParsedData([]);
        }
    };

    const handleConfirm = () => {
        onImport(parsedData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Bulk Import Questions</DialogTitle>
                    <DialogDescription>
                        Paste your CSV content below. columns: Question, Marks, Option 1, Option 2, Option 3, Option 4, Correct Answer (1-4), Image URL.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4 py-4">
                    {!parsedData.length ? (
                        <div className="space-y-2">
                            <Textarea
                                placeholder="Paste CSV here..."
                                className="h-64 font-mono text-xs"
                                value={csvContent}
                                onChange={e => setCsvContent(e.target.value)}
                            />
                            <Button onClick={handleParse} disabled={!csvContent.trim()}>Parse</Button>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Question</TableHead>
                                        <TableHead className="w-16">Marks</TableHead>
                                        <TableHead>Options</TableHead>
                                        <TableHead className="w-20">Correct</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsedData.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="max-w-xs truncate">{row.text}</TableCell>
                                            <TableCell>{row.marks}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {row.options.map((o: any) => o.text).join(', ')}
                                            </TableCell>
                                            <TableCell>{row.correctOptionIndex + 1}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {error && (
                        <div className="rounded border border-destructive/50 p-4 text-destructive flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <div>
                                <h5 className="font-medium leading-none tracking-tight">Error Parsing CSV</h5>
                                <div className="text-sm opacity-90 mt-1">{error}</div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {parsedData.length > 0 && (
                        <Button variant="outline" onClick={() => setParsedData([])}>Back to Edit</Button>
                    )}
                    <Button onClick={handleConfirm} disabled={!parsedData.length || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import {parsedData.length} Questions
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
