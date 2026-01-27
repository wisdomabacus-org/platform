
export interface QuestionBank {
    id: string;
    title: string;
    description?: string;
    minGrade: number;
    maxGrade: number;
    tags: string[];
    isActive: boolean;
    questionsCount: number;
    usageCount: number;
    createdAt: Date;
}

export type QuestionType = 'mcq'; // Schema limitation for now

export interface QuestionOption {
    id: string;
    text: string;
    index: number;
}

export interface Question {
    id: string;
    bankId: string;
    text: string;
    imageUrl?: string;
    options: QuestionOption[];
    correctOptionIndex: number;
    marks: number;
    createdAt: Date;
}
