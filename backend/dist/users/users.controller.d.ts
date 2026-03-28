import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: number;
            username: string;
            role: import("./entities/user.entity").UserRole;
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
}
