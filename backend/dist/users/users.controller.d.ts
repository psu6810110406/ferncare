import type { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: number;
            username: string;
            role: import("./entities/user.entity").UserRole;
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
        };
    }>;
    findAllUsers(): Promise<Partial<import("./entities/user.entity").User>[]>;
    makeAdmin(id: string): Promise<{
        message: string;
        user: {
            id: number;
            username: string;
            role: import("./entities/user.entity").UserRole;
        };
    }>;
    getProfile(id: string, req: Request): Promise<Partial<import("./entities/user.entity").User>>;
    updateProfile(id: string, updateUserDto: UpdateUserDto, req: Request): Promise<Partial<import("./entities/user.entity").User>>;
}
