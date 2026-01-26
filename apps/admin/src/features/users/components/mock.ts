import { AuthProvider, User, UserStatus } from '../../users/types/user.types';

export const mockUsers: User[] = Array.from({ length: 125 }).map((_, i) => {
  const phone = `+91-98${(10000000 + i).toString().slice(0, 8)}`;
  const google = i % 3 === 0;
  const grade = (i % 10) + 1;

  return {
    id: `${1000 + i}`,
    authProvider: google ? AuthProvider.GOOGLE : AuthProvider.PHONE,
    phone,
    email: google ? `parent${i}@mail.com` : undefined,
    googleId: google ? `gid_${1000 + i}` : undefined,
    parentName: `Parent ${i}`,
    studentName: `Student ${i}`,
    studentGrade: grade,
    schoolName: `School ${grade}`,
    city: ['Hyderabad', 'Bengaluru', 'Chennai', 'Pune'][i % 4],
    state: ['TS', 'KA', 'TN', 'MH'][i % 4],
    isProfileComplete: i % 5 !== 0,
    status: i % 11 === 0 ? UserStatus.BANNED : UserStatus.ACTIVE,
    adminNotes: i % 9 === 0 ? 'Needs phone verify' : undefined,
    enrolledCompetitions: i % 2 === 0 ? ['c1', 'c2'] : ['c3'],
    attemptedMockTests: i % 4 === 0 ? [{ mockTestId: 'm1', submissionId: 's1' }] : [],
    activeSubscription: i % 7 === 0 ? 'sub_123' : null,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
  };
});
