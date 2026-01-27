import { User } from '../types/user.types';

export const mockUsers: User[] = Array.from({ length: 125 }).map((_, i) => {
  const phone = `+91-98${(10000000 + i).toString().slice(0, 8)}`;
  const isGoogle = i % 3 === 0;
  const grade = (i % 10) + 1;

  return {
    id: `user-${1000 + i}`,
    uid: `auth-uid-${1000 + i}`,
    authProvider: isGoogle ? 'google' : 'phone',
    phone: isGoogle ? null : phone,
    email: isGoogle ? `parent${i}@mail.com` : null,
    emailVerified: isGoogle || i % 5 === 0,
    parentName: `Parent ${i}`,
    studentName: `Student ${i}`,
    studentGrade: grade,
    schoolName: `School ${grade}`,
    city: ['Hyderabad', 'Bengaluru', 'Chennai', 'Pune'][i % 4],
    state: ['TS', 'KA', 'TN', 'MH'][i % 4],
    isProfileComplete: i % 5 !== 0,
    dateOfBirth: '1995-01-01',
    lastLogin: i % 3 === 0 ? new Date(Date.now() - i * 3600000) : null,
    createdAt: new Date(Date.now() - i * 86400000),
    updatedAt: new Date(Date.now() - i * 3600000),
    enrollmentCount: i % 2 === 0 ? 2 : 1,
  };
});
