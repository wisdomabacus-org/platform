export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  imageUrl?: string;
}

export const mockQuestions: Question[] = [
  {
    id: 1,
    text: "What is 247 + 586?",
    options: ["833", "823", "843", "853"],
    correctAnswer: 0,
  },
  {
    id: 2,
    text: "Calculate: 15 × 8",
    options: ["110", "120", "130", "140"],
    correctAnswer: 1,
  },
  {
    id: 3,
    text: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
  },
  {
    id: 4,
    text: "Solve: 1000 ÷ 25",
    options: ["35", "40", "45", "50"],
    correctAnswer: 1,
  },
  {
    id: 5,
    text: "What is 67 × 11?",
    options: ["727", "737", "747", "757"],
    correctAnswer: 1,
  },
  {
    id: 6,
    text: "Calculate: 456 - 289",
    options: ["157", "167", "177", "187"],
    correctAnswer: 1,
  },
  {
    id: 7,
    text: "What is 25% of 800?",
    options: ["150", "175", "200", "225"],
    correctAnswer: 2,
  },
  {
    id: 8,
    text: "Solve: 13² (13 squared)",
    options: ["159", "169", "179", "189"],
    correctAnswer: 1,
  },
  {
    id: 9,
    text: "What is 7 × 8 × 9?",
    options: ["484", "494", "504", "514"],
    correctAnswer: 2,
  },
  {
    id: 10,
    text: "Calculate: 3456 ÷ 12",
    options: ["278", "288", "298", "308"],
    correctAnswer: 1,
  },
  {
    id: 11,
    text: "What is 15³ (15 cubed)?",
    options: ["3125", "3225", "3375", "3425"],
    correctAnswer: 2,
  },
  {
    id: 12,
    text: "Solve: 999 + 888 + 777",
    options: ["2564", "2614", "2664", "2714"],
    correctAnswer: 2,
  },
  {
    id: 13,
    text: "What is 40% of 350?",
    options: ["120", "130", "140", "150"],
    correctAnswer: 2,
  },
  {
    id: 14,
    text: "Calculate: 625 ÷ 5",
    options: ["115", "120", "125", "130"],
    correctAnswer: 2,
  },
  {
    id: 15,
    text: "What is 23 × 17?",
    options: ["381", "391", "401", "411"],
    correctAnswer: 1,
  },
  {
    id: 16,
    text: "Solve: 5000 - 3247",
    options: ["1743", "1753", "1763", "1773"],
    correctAnswer: 1,
  },
  {
    id: 17,
    text: "What is the cube root of 1000?",
    options: ["8", "9", "10", "11"],
    correctAnswer: 2,
  },
  {
    id: 18,
    text: "Calculate: 144 ÷ 12 × 5",
    options: ["50", "55", "60", "65"],
    correctAnswer: 2,
  },
  {
    id: 19,
    text: "What is 18 × 25?",
    options: ["430", "440", "450", "460"],
    correctAnswer: 2,
  },
  {
    id: 20,
    text: "Solve: (45 + 55) × 8",
    options: ["780", "790", "800", "810"],
    correctAnswer: 2,
  },
];
