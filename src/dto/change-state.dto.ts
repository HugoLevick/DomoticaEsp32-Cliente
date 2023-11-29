import { IsOptional, IsString, MinLength } from '@nestjs/class-validator';
import { IsBoolean } from 'class-validator';

export class ChangeLedStateDto {
  @IsString()
  @MinLength(1)
  ledName: string;

  @IsBoolean()
  @IsOptional()
  state: boolean;
}
