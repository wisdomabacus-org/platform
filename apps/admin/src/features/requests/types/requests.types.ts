
export type RequestStatus = 'pending' | 'resolved' | 'ignored';
export type RequestType = 'contact' | 'demo' | 'withdrawal';

export interface BaseRequest {
    id: string;
    type: RequestType;
    status: RequestStatus;
    createdAt: Date;
    updatedAt: Date;
    userEmail?: string;
    userPhone?: string;
    userName?: string;
}

export interface ContactRequest extends BaseRequest {
    type: 'contact';
    subject: string;
    message: string;
    adminResponse?: string;
}

export interface DemoRequest extends BaseRequest {
    type: 'demo';
    studentName: string;
    parentName: string;
    grade: number;
    slot: string;
    adminNotes?: string;
}

// Placeholder for withdrawal until schema exists
export interface WithdrawalRequest extends BaseRequest {
    type: 'withdrawal';
    amount: number;
    bankDetails?: string;
}

export type AnyRequest = ContactRequest | DemoRequest | WithdrawalRequest;

export interface RequestFilters {
    type?: RequestType;
    status?: string;
    search?: string;
    dateRange?: { from: Date; to: Date };
}
