export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
}
