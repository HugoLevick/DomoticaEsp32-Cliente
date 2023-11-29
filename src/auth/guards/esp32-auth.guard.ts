import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class Esp32AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const ip = req.ip;
    const esp32Ip = process.env.ESP32_ADDRESS.split('//')[1];

    if (ip !== `::ffff:${esp32Ip}` && ip !== '::1') {
      throw new UnauthorizedException();
    }

    return true;
  }
}
