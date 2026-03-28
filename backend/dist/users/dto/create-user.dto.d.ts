import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    username: string;
    password: string;
    role?: UserRole;
    fullName?: string;
    age?: number;
    phone?: string;
    address?: string;
    weight?: number;
    height?: number;
    bloodType?: string;
    congenitalDisease?: string;
    allergies?: string;
    defaultMobilityStatus?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
}
