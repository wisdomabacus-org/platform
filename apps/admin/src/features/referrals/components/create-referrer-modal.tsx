
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Plus } from 'lucide-react';
import { referrerSchema, ReferrerFormValues } from './referrer-schema';
import { useState, useEffect } from 'react';
import { Referrer } from '../types/referrals.types';

interface ReferrerFormModalProps {
    onConfirm: (data: ReferrerFormValues & { id?: string }) => void;
    referrer?: Referrer; // If present, we are editing
    trigger?: React.ReactNode;
}

export function ReferrerFormModal({ onConfirm, referrer, trigger }: ReferrerFormModalProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<ReferrerFormValues>({
        resolver: zodResolver(referrerSchema) as any,
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            code: '',
            status: 'active',
        },
    });

    // Reset form when modal opens or referrer changes
    useEffect(() => {
        if (open) {
            if (referrer) {
                form.reset({
                    name: referrer.name,
                    email: referrer.email || '',
                    phone: referrer.phone || '',
                    code: referrer.code,
                    status: referrer.status,
                });
            } else {
                form.reset({
                    name: '',
                    email: '',
                    phone: '',
                    code: '',
                    status: 'active',
                });
            }
        }
    }, [open, referrer, form]);

    const onSubmit = (data: ReferrerFormValues) => {
        onConfirm({ ...data, id: referrer?.id });
        setOpen(false);
        form.reset();
    };

    const generateCode = () => {
        const name = form.getValues('name');
        if (name) {
            const code = name.slice(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000).toString();
            form.setValue('code', code, { shouldValidate: true });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Referrer
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{referrer ? 'Edit Referrer' : 'Create New Referrer'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                        <FormField
                            control={form.control as any}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} onBlur={() => {
                                            field.onBlur();
                                            if (!form.getValues('code') && !referrer) generateCode();
                                        }} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+91 9999999999" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <FormField
                                control={form.control as any}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Referral Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="JOH1234" {...field} disabled={!!referrer} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!referrer && (
                                <Button type="button" variant="outline" onClick={generateCode} className="mb-0">
                                    Generate
                                </Button>
                            )}
                        </div>

                        <FormField
                            control={form.control as any}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">{referrer ? 'Update Referrer' : 'Create Referrer'}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
