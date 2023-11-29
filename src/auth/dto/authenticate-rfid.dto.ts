import { IsString, Length } from 'class-validator';

export class AuthenticateRfidDto {
  @IsString()
  @Length(8, 8)
  uid: string;
}
