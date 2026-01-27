
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
    onImport: (users: any[]) => void;
    isLoading: boolean;
}

export function BulkUserImportModal({ open, onOpenChange, onImport, isLoading }: Props) {
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

            // Expected format: Name, Email, Phone, Grade, School, City
            const data = rows.slice(1).map((row, index) => {
                const cols = row.split(',').map(c => c.trim());

                // Allow simple validation
                // Name (0), Email (1), Phone (2), Grade (3), School (4), City (5)
                const studentName = cols[0];
                const email = cols[1];
                const phone = cols[2];
                const studentGrade = parseInt(cols[3]) || null;
                const schoolName = cols[4] || '';
                const city = cols[5] || '';

                if (!studentName) throw new Error(`Row ${index + 2}: Student Name is missing`);
                if (!email && !phone) throw new Error(`Row ${index + 2}: Either Email or Phone is required`);

                return {
                    studentName,
                    email,
                    phone,
                    studentGrade,
                    schoolName,
                    city
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
                    <DialogTitle>Bulk Import Users</DialogTitle>
                    <DialogDescription>
                        Paste your CSV content below. Columns: Name, Email, Phone, Grade, School, City.
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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>School</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsedData.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{row.studentName}</TableCell>
                                            <TableCell>{row.email || '—'}</TableCell>
                                            <TableCell>{row.phone || '—'}</TableCell>
                                            <TableCell>{row.studentGrade}</TableCell>
                                            <TableCell className="truncate max-w-[150px]">{row.schoolName}</TableCell>
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
                        Import {parsedData.length} Users
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
