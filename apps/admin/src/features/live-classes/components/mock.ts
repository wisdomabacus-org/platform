import { LiveClassInfo } from '../types/live-class.types';

function datePlus(hours: number) {
  return new Date(Date.now() + hours * 3600000);
}

export const mockLiveClasses: LiveClassInfo[] = Array.from({ length: 32 }).map((_, i) => {
  const active = i % 5 !== 0;
  const langs = i % 2 === 0 ? ['Telugu', 'English'] : ['English'];
  return {
    id: `${7000 + i}`,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    materialLink: 'https://drive.google.com/folder/materials',
    nextTopic: `Abacus L${(i % 5) + 1}: Speed Drills`,
    nextClassAt: datePlus((i % 10) * 12 + 6),
    scheduleInfo: 'Tue/Thu 5:00 PM IST',
    isActive: active,
    title: `Beginner Batch ${String.fromCharCode(65 + (i % 6))}`,
    tags: [...langs, i % 3 === 0 ? 'Beginner' : 'Intermediate'],
  };
});
