import { IsUUID } from 'class-validator';

export class AssignRfidDto {
  @IsUUID()
  userId: string;
}
