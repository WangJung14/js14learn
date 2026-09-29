import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';
declare const JwtAuthGuard_base: import("@nestjs/passport", { with: { "resolution-mode": "import" } }).Type<import("@nestjs/passport", { with: { "resolution-mode": "import" } }).IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest<TUser = JwtPayload>(err: unknown, user: TUser): TUser;
}
export {};
