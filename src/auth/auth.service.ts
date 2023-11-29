import * as bcrypt from 'bcrypt';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { requestEsp } from 'src/common/helpers/requestEsp';
import { AssignRfidDto } from './dto/assign-rfid.dto';
import { AuthenticateRfidDto } from './dto/authenticate-rfid.dto';
import { Response } from 'express';
import { AuthGateway } from './auth.gateway';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly authGateway: AuthGateway,
  ) {}

  private readonly logger = new Logger('AuthService');

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    return user;
  }

  async findOneByUid(uid: string) {
    const user = await this.userRepository.findOne({ where: { rfidUid: uid } });
    if (!user) {
      throw new NotFoundException(`User with uid '${uid}' not found`);
    }

    return user;
  }

  async register(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const user = this.userRepository.create({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
    });

    try {
      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      select: { id: true, password: true },
      where: { email: loginUserDto.email },
    });

    if (!bcrypt.compareSync(loginUserDto.password, user.password)) {
      throw new NotFoundException(`Invalid login`);
    }

    delete user.password;
    const token = this.jwtService.sign({ userId: user.id });
    return {
      message: 'Logged in successfully',
      statusCode: 200,
      token,
    };
  }

  async assignRfid(assignRfidDto: AssignRfidDto) {
    const { userId } = assignRfidDto;
    let uid: string;

    const response = await requestEsp(`/asignarRfid`, 'GET');
    if (!response.ok) throw new BadRequestException(await response.text());

    const data = await response.json();
    uid = data.uid;

    const user = await this.findOne(userId);
    user.rfidUid = uid;
    try {
      await this.userRepository.save(user);
      return {
        message: 'RFID asignado',
        statusCode: 200,
      };
    } catch (error) {
      if (error.detail.includes('already exists'))
        throw new BadRequestException('La tarjeta ya está asignada');
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async authenticateRfid(
    authenticateRfidDto: AuthenticateRfidDto,
    response: Response,
  ) {
    const { uid } = authenticateRfidDto;
    const user = await this.userRepository.findOne({
      select: { name: true },
      where: { rfidUid: uid },
    });

    if (!user) {
      response.status(HttpStatus.UNAUTHORIZED);
      return;
    }

    response.status(HttpStatus.OK);
    return;
  }

  showAlarm(motivo: string, response: Response) {
    this.authGateway.emitAlarm(motivo);
    response.status(HttpStatus.OK);
    return;
  }

  async getAlarms() {
    const response = await requestEsp('/alarmas', 'GET');
    if (!response.ok)
      throw new InternalServerErrorException(
        'Hubo un error al obtener las alarmas. ' + response.status,
      );

    const alarmas = await response.json();

    return alarmas;
  }

  async silenceAlarms() {
    const response = await requestEsp('/silenciarAlarmas', 'GET');
    if (!response.ok)
      throw new InternalServerErrorException(
        'Hubo un error al silenciar las alarmas. ' + response.status,
      );

    return;
  }
}
