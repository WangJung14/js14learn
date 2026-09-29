import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<Record<string, unknown>>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<Record<string, unknown>>;
    findAll(): Promise<Record<string, unknown>[]>;
    findOne(id: string): Promise<Record<string, unknown>>;
    updateRole(id: string, dto: UpdateRoleDto): Promise<Record<string, unknown>>;
}
