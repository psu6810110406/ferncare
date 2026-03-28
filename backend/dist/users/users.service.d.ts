import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findOneByUsername(username: string): Promise<User | null>;
    findAll(): Promise<Partial<User>[]>;
    makeAdmin(id: number): Promise<{
        message: string;
        user: {
            id: number;
            username: string;
            role: import("./entities/user.entity").UserRole;
        };
    }>;
    findOneById(id: number): Promise<Partial<User>>;
    updateProfile(id: number, updateData: any): Promise<Partial<User>>;
}
