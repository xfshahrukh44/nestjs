import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (request['user']?.role_id === 1) {
            // User has the admin role, allow access to the route
            return true;
        } else {
            // User is not an admin, send a forbidden response
            throw new UnauthorizedException ({
                success: false,
                message: 'Not allowed.',
                data: [],
            });
        }
    }
}
