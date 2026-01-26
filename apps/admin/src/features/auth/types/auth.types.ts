export interface Admin {
  id: string;
  username: string;
  name?: string;
  status: AdminStatus;
}

export enum AdminStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  name?: string;
  status: AdminStatus;
}
