import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AssignRfidDto } from './dto/assign-rfid.dto';
import { Auth } from './decorators/auth.decorator';
import { RolesEnum } from './enums/roles.enum';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Esp32Auth } from './decorators/esp32auth.decorator';
import { AuthenticateRfidDto } from './dto/authenticate-rfid.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Auth(RolesEnum.ADMIN)
  @Post('/rfid/asignar')
  assignRfid(@Body() assignRfidDto: AssignRfidDto, @GetUser() user: User) {
    return this.authService.assignRfid(assignRfidDto);
  }

  @Esp32Auth()
  @Post('/rfid/autenticar')
  authenticareRfid(
    @Body() authenticateRfidDto: AuthenticateRfidDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.authenticateRfid(authenticateRfidDto, res);
  }

  @Esp32Auth()
  @Post('/alarmas')
  showAlarm(
    @Body() { motivo }: { motivo: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.showAlarm(motivo, res);
  }

  @Get('/alarmas')
  getAlarms() {
    return this.authService.getAlarms();
  }

  @Get('/alarmas/silenciar')
  silenceAlarms() {
    return this.authService.silenceAlarms();
  }
}
