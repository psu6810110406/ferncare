import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // บอกให้ดึง Token มาจาก Header ตรง Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MY_SUPER_SECRET_KEY', // ต้องตรงกับใน auth.module.ts
    });
  }

  // ถ้า Token ถูกต้อง ข้อมูลที่ Return จากตรงนี้จะไปโผล่ใน req.user อัตโนมัติ
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}