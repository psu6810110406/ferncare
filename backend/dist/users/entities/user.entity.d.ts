export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    fullName: string;
    age: string;
    phone: string;
    address: string;
    congenitalDisease: string;
    allergies: string;
    bloodType: string;
    weight: number;
    height: number;
    defaultMobilityStatus: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
}
