// types/request.ts

export interface DemoRequest {
    studentName: string;
    grade: number;
    parentName: string;
    phone: string;
    email: string;
    slot: 'weekend' | 'weekday';
}

export interface ContactRequest {
    name: string;
    email: string;
    phone: string;
    subject: 'admissions' | 'technical' | 'general' | 'partnership';
    message: string;
}

export interface RequestResponse {
    message: string;
    requestId: string;
}
