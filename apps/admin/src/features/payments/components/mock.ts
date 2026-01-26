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
const methods: Payment['method'][] = ['razorpay', 'upi', 'card', 'netbanking', 'wallet', 'cash'];

export const mockPayments: Payment[] = Array.from({ length: 80 }).map((_, i) => {
  const n = names[i % names.length];
  const comp = comps[i % comps.length];
  const status: Payment['status'] =
    i % 11 === 0 ? 'refunded' : i % 5 === 0 ? 'failed' : i % 4 === 0 ? 'pending' : 'success';

  return {
    id: `${50000 + i}`,
    orderId: `PAY-${202500 + i}`,
    userName: `${n} ${i}`,
    userPhone: `+91-98${(10000000 + i).toString().slice(0, 8)}`,
    competitionId: comp.id,
    competitionTitle: comp.title,
    amount: 100 + (i % 5) * 50,
    currency: 'INR',
    method: methods[i % methods.length],
    status,
    createdAt: dateMinus(i * 3),
  };
});
