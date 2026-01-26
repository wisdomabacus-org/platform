import type { StaticImageData } from 'next/image';
import abacusImage from '@/lib/assets/abacus-detail.jpg';

export interface Competition {
  id: string;
  title: string;
  description: string;
  image: StaticImageData;
  status: 'open' | 'in-progress' | 'completed';
  registrationEndDate: Date;
  examDate: Date;
  examStartTime: string;
  examEndTime: string;
  resultsAnnouncementDate: Date;
  isResultsPublished: boolean;
  enrollmentFee: number;
  applicableGrades: string[];
  rules: string[];
  prizeDetails: string;
}

export interface MockTest {
  id: string;
  title: string;
  duration: number;
  grades: string[];
  description: string;
  takenBy: number;
  topScore: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  grade: string;
  score: number;
  school?: string;
}

// Mock Competitions
export const mockCompetitions: Competition[] = [
  {
    id: 'national-championship-2025',
    title: 'National Abacus Championship 2025 - Junior Level',
    description: 'The biggest abacus competition of the year! Compete with the best minds across India and showcase your mental math prowess.',
    image: abacusImage,
    status: 'open',
    registrationEndDate: new Date('2025-12-15'),
    examDate: new Date('2025-12-20'),
    examStartTime: '10:00 AM',
    examEndTime: '11:30 AM',
    resultsAnnouncementDate: new Date('2025-12-25'),
    isResultsPublished: false,
    enrollmentFee: 150,
    applicableGrades: ['Grade 1-3'],
    rules: [
      'Students must complete the exam within the allocated time',
      'No calculators or external aids allowed',
      'Internet connection required throughout the exam',
      'Each question carries equal marks',
      'Negative marking applies for wrong answers'
    ],
    prizeDetails: '🏆 Winner: ₹10,000 | 🥈 Runner-up: ₹5,000 | 🥉 3rd Place: ₹3,000'
  },
  {
    id: 'state-level-qualifier',
    title: 'State Level Qualifier - Maharashtra',
    description: 'Qualify for the national championship through this state-level competition.',
    image: abacusImage,
    status: 'in-progress',
    registrationEndDate: new Date('2025-11-10'),
    examDate: new Date('2025-11-15'),
    examStartTime: '2:00 PM',
    examEndTime: '3:00 PM',
    resultsAnnouncementDate: new Date('2025-11-18'),
    isResultsPublished: false,
    enrollmentFee: 100,
    applicableGrades: ['Grade 4-6'],
    rules: [
      'Open only for Maharashtra residents',
      'Top 50 students qualify for nationals',
      'Valid school ID required'
    ],
    prizeDetails: 'Top 50 students qualify for National Championship'
  },
  {
    id: 'junior-champion-2024',
    title: 'Junior Champion Cup 2024',
    description: 'Special competition for younger students to build confidence and skills.',
    image: abacusImage,
    status: 'completed',
    registrationEndDate: new Date('2024-10-01'),
    examDate: new Date('2024-10-15'),
    examStartTime: '11:00 AM',
    examEndTime: '12:00 PM',
    resultsAnnouncementDate: new Date('2024-10-20'),
    isResultsPublished: true,
    enrollmentFee: 75,
    applicableGrades: ['Grade 1-3'],
    rules: [
      'Age limit: 6-9 years',
      'Basic abacus operations only',
      'Parent supervision allowed'
    ],
    prizeDetails: '🏆 Winner: ₹5,000 | Top 10 get participation certificates'
  },
  {
    id: 'speed-math-challenge',
    title: 'Speed Math Challenge',
    description: 'Test your speed and accuracy in mental calculations.',
    image: abacusImage,
    status: 'open',
    registrationEndDate: new Date('2025-12-01'),
    examDate: new Date('2025-12-05'),
    examStartTime: '4:00 PM',
    examEndTime: '5:00 PM',
    resultsAnnouncementDate: new Date('2025-12-08'),
    isResultsPublished: false,
    enrollmentFee: 100,
    applicableGrades: ['Grade 4-6'],
    rules: [
      'Focus on speed and accuracy',
      'Bonus points for fastest correct answers',
      'Multiple difficulty levels'
    ],
    prizeDetails: '🏆 Cash prizes for top 3 in each grade category'
  }
];

// Mock Tests
export const mockTests: MockTest[] = [
  {
    id: 'mock-basic-addition',
    title: 'Level 1 Practice Test - Set A',
    duration: 30,
    grades: ['Grade 1-3'],
    description: 'Practice basic addition and subtraction with single and double-digit numbers.',
    takenBy: 245,
    topScore: 95
  },
  {
    id: 'mock-multiplication',
    title: 'Level 2 Practice Test - Set A',
    duration: 45,
    grades: ['Grade 4-6'],
    description: 'Master multiplication tables and complex multiplication problems.',
    takenBy: 189,
    topScore: 98
  },
  {
    id: 'mock-speed-test',
    title: 'Level 2 Practice Test - Set B',
    duration: 30,
    grades: ['Grade 4-6'],
    description: 'Quick-fire questions covering all basic operations. Test your speed!',
    takenBy: 156,
    topScore: 92
  },
  {
    id: 'mock-basic-addition-b',
    title: 'Level 1 Practice Test - Set B',
    duration: 30,
    grades: ['Grade 1-3'],
    description: 'Additional practice for foundational skills.',
    takenBy: 312,
    topScore: 97
  },
  {
    id: 'mock-advanced-set-a',
    title: 'Level 3 Practice Test - Set A',
    duration: 45,
    grades: ['Grade 4-6'],
    description: 'Advanced problems for competition preparation.',
    takenBy: 134,
    topScore: 94
  }
];

// Mock Leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Aarav Sharma', grade: 'Grade 7', score: 98, school: 'Delhi Public School' },
  { rank: 2, name: 'Diya Patel', grade: 'Grade 8', score: 96, school: 'Modern School' },
  { rank: 3, name: 'Rohan Kumar', grade: 'Grade 7', score: 94, school: 'St. Xavier\'s School' },
  { rank: 4, name: 'Ananya Singh', grade: 'Grade 9', score: 92, school: 'Cambridge School' },
  { rank: 5, name: 'Farooque Reddy', grade: 'Grade 8', score: 91, school: 'National Public School' },
  { rank: 6, name: 'Priya Gupta', grade: 'Grade 7', score: 89, school: 'Ryan International' },
  { rank: 7, name: 'Kabir Malhotra', grade: 'Grade 9', score: 88, school: 'DPS Bangalore' },
  { rank: 8, name: 'Ishita Joshi', grade: 'Grade 8', score: 87, school: 'Greenwood High' },
  { rank: 9, name: 'Vihaan Agarwal', grade: 'Grade 7', score: 86, school: 'Shiv Nadar School' },
  { rank: 10, name: 'Aisha Khan', grade: 'Grade 9', score: 85, school: 'Bishop Cotton School' }
];
