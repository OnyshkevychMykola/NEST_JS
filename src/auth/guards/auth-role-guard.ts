import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthRoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
                ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return false;
        }
        const token = authHeader.slice(7);
        try {
            const decoded = this.jwtService.verify(token);
            const userRoles = decoded.roles;
            if (roles.some((role) => userRoles.includes(role))) {
                return true;
            }
        } catch (error) {
            return false;
        }

        return false;
    }
}
