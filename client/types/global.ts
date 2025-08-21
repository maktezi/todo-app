export interface LoginResponse {
    token: string;
    user: {
        name: string;
        email: string;
    };
}

export interface FormState {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface FormStateRegister {
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    password: string;
}

export interface AnyObject {
    [key: string]: any;
}
