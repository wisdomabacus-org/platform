
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/shared/components/ui/button';
import { Loader2, X, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    value?: string;
    onChange: (url: string) => void;
    bucket?: string;
    folder?: string;
}

export function ImageUpload({ value, onChange, bucket = 'question-images', folder = 'questions' }: Props) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type and size
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size must be less than 2MB');
            return;
        }

        try {
            setIsUploading(true);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = folder ? `${folder}/${fileName}` : fileName;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            onChange(publicUrl);
            toast.success('Image uploaded successfully');
        } catch (error: any) {
            toast.error('Error uploading image');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className="flex flex-col gap-4">
            {value ? (
                <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-slate-100 dark:bg-slate-800">
                    <img src={value} alt="Uploaded" className="h-full w-full object-contain" />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-lg bg-muted/30">
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <ImageIcon className="h-6 w-6" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">Click to upload image</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={isUploading}
                            />
                        </label>
                    )}
                </div>
            )}
        </div>
    );
}
