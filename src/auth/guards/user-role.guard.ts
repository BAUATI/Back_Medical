import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLS } from '../decorators/rol-protected.decorator';
import { ValidRols } from '../interfaces/valid-rols';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ValidRols[]>(META_ROLS, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Parsear rols si es un string JSON
    let userRoles: string[];
    try {
      userRoles = typeof user.rols === 'string' ? JSON.parse(user.rols) : user.rols;
    } catch (error) {
      throw new ForbiddenException('Error al parsear los roles del usuario');
    }

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(`No tienes los permisos necesarios. Roles requeridos: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}