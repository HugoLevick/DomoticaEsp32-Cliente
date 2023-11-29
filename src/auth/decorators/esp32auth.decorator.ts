import { applyDecorators, UseGuards } from '@nestjs/common';
import { Esp32AuthGuard } from '../guards/esp32-auth.guard';

export function Esp32Auth() {
  return applyDecorators(UseGuards(Esp32AuthGuard));
}
