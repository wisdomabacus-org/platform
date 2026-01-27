import { Enrollment } from '../types/enrollment.types';

function dateMinus(days: number) {
  return new Date(Date.now() - days * 86400000);
}

const names = ['Aarav', 'Vivaan', 'Aditya', 'Diya', 'Ishita', 'Riya', 'Arjun', 'Ananya'];
const comps = [
  { id: 'c1', title: 'Abacus Championship South' },
  { id: 'c2', title: 'Abacus Championship North' },
  { id: 'c3', title: 'National Juniors' },
];

export const mockEnrollments: Enrollment[] = Array.from({ length: 64 }).map((_, i) => {
  const n = names[i % names.length];
  const comp = comps[i % comps.length];
  const status = i % 7 === 0 ? 'cancelled' : i % 3 === 0 ? 'pending' : 'confirmed';
  const pay = status === 'cancelled' ? 'refunded' : i % 5 === 0 ? 'failed' : i % 3 === 0 ? 'pending' : 'success';

  return {
    id: `${10000 + i}`,
    userId: `u-${i}`,
    userName: `${n} ${i}`,
    userPhone: `+91-98${(10000000 + i).toString().slice(0, 8)}`,
    competitionId: comp.id,
    competitionTitle: comp.title,
    competitionSeason: '2024',
    status,
    isPaymentConfirmed: pay === 'success',
    paymentId: `pay-${i}`,
    registeredAt: dateMinus(i),
  };
});
