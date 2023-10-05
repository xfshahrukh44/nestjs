import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {jwtConstants} from './constants';
import {Request} from 'express';
import {UsersService} from "../users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject('USER_MODEL')
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            // so that we can access it in our route handlers
            request['user'] = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
        } catch (e) {
            console.log(e);
            throw new UnauthorizedException();
        }

        //if user is blocked
        let user = await this.usersService.findOne(request['user'].id);

        if (user.blocked_at && user.blocked_at != "") {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
