import { Payment } from '../types/payment.types';

function dateMinus(hours: number) {
  return new Date(Date.now() - hours * 3600000);
}

const names = ['Aarav', 'Vivaan', 'Aditya', 'Diya', 'Ishita', 'Riya', 'Arjun', 'Ananya'];
const comps = [
  { id: 'c1', title: 'Abacus Championship South' },
  { id: 'c2', title: 'Abacus Championship North' },
  { id: 'c3', title: 'National Juniors' },
];

export const mockPayments: Payment[] = Array.from({ length: 80 }).map((_, i) => {
  const n = names[i % names.length];
  const comp = comps[i % comps.length];
  const status: any =
    i % 11 === 0 ? 'refunded' : i % 5 === 0 ? 'failed' : i % 4 === 0 ? 'pending' : 'success';

  return {
    id: `${50000 + i}`,
    userId: `u-${i}`,
    userName: `${n} ${i}`,
    userPhone: `+91-98${(10000000 + i).toString().slice(0, 8)}`,
    amount: 100 + (i % 5) * 50,
    currency: 'INR',
    status,
    purpose: 'competition_enrollment',
    referenceId: comp.id,
    gateway: 'razorpay',
    razorpayOrderId: `PAY-${202500 + i}`,
    createdAt: dateMinus(i * 3),
    updatedAt: dateMinus(i * 3),
  };
});
