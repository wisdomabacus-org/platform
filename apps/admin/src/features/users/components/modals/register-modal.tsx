import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/shared/components/ui/select';
import { useUsersUiStore } from '../../store/users-ui.store';

const schema = z.object({
  phone: z.string().min(8, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  parentName: z.string().min(2, 'Required'),
  studentName: z.string().min(2, 'Required'),
  studentGrade: z.string().optional(), // keep string for Select; cast on submit if needed
  schoolName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function UsersRegisterModal() {
  const { registerOpen, setRegisterOpen } = useUsersUiStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: '',
      email: '',
      parentName: '',
      studentName: '',
      studentGrade: '',
      schoolName: '',
      city: '',
      state: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!registerOpen) {
      reset();
    }
  }, [registerOpen, reset]);

  const onSubmit = async (values: FormValues) => {
    // Leave wiring for later; for now just close after validate
    // In future: mutate -> onSuccess close and invalidate users list
    console.log('Register user payload (preview):', values);
    setRegisterOpen(false);
  };

  return (
    <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register user</DialogTitle>
          <DialogDescription>
            Create a new user account. Provider will be phone by default for admin
            registration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Phone & Email */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+91-9XXXXXXXXX" {...register('phone')} />
              {errors.phone && (
                <p className="text-destructive text-xs">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" placeholder="parent@example.com" {...register('email')} />
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Set initial password"
                {...register('password')}
              />
            </div>
          </div>

          {/* Parent & Student */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent name</Label>
              <Input
                id="parentName"
                placeholder="Parent full name"
                {...register('parentName')}
              />
              {errors.parentName && (
                <p className="text-destructive text-xs">{errors.parentName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName">Student name</Label>
              <Input
                id="studentName"
                placeholder="Student full name"
                {...register('studentName')}
              />
              {errors.studentName && (
                <p className="text-destructive text-xs">{errors.studentName.message}</p>
              )}
            </div>
          </div>

          {/* Grade & School */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Grade</Label>
              <Select
                value={''} // controlled via setValue on change only
                onValueChange={(v) => setValue('studentGrade', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">UKG (0)</SelectItem>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((g) => (
                    <SelectItem key={g} value={String(g)}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studentGrade && (
                <p className="text-destructive text-xs">
                  {errors.studentGrade.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolName">School</Label>
              <Input
                id="schoolName"
                placeholder="School name"
                {...register('schoolName')}
              />
            </div>
          </div>

          {/* City & State */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" {...register('city')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="State" {...register('state')} />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRegisterOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
