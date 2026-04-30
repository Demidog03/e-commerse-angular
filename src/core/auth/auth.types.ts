export interface LoginBody {
    email: string;
    password: string;
}

export interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    token: string;
    user: User;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface GetMeResponse {
    user: User;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}