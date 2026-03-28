import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // ถ้าไม่ได้แปะป้าย @Roles ไว้ แปลว่าใครก็เข้าได้
    }
    const { user } = context.switchToHttp().getRequest();
    // เช็คว่า Role ของ User มีอยู่ในป้ายที่แปะไว้หรือไม่
    return requiredRoles.includes(user.role);
  }
}