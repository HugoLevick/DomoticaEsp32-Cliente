import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChangeLedStateDto } from './dto/change-state.dto';
import { Socket } from 'socket.io';
import { AppGateway } from './app.gateway';
import { requestEsp } from './common/helpers/requestEsp';
import { AuthService } from './auth/auth.service';
import { User } from './auth/entities/user.entity';
import { RolesEnum } from './auth/enums/roles.enum';

@Injectable()
export class AppService {
  constructor(
    private readonly appGateway: AppGateway,
    private readonly authService: AuthService,
  ) {}

  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });

    // Handle other events and messages from the client
  }

  async getLeds() {
    const response = await requestEsp('/leds', 'GET');
    return response.json();
  }

  async changeLedState(changeLedStateDto: ChangeLedStateDto) {
    const { ledName, state } = changeLedStateDto;

    let accion = state === true ? 'encender' : 'apagar';

    try {
      const response = await requestEsp(
        `/leds?dispositivo=${ledName}${
          state !== undefined ? `&accion=${accion}` : ''
        }`,
        'POST',
      );

      if (response.ok) {
        const data = await response.json();
        this.appGateway.emitLedUpdate(ledName, data.state);
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'No se pudo cambiar el estado del led',
      );
    }
  }

  async getStats() {
    const response = await requestEsp('/estadisticas', 'GET');
    if (response.ok) {
      const stats = await response.json();
      let usuario: User | any;
      if (stats.acceso != '') {
        try {
          usuario = await this.authService.findOneByUid(stats.acceso);
        } catch (error) {
          usuario = {
            name: 'Intruso',
            rfidUid: stats.acceso,
          };
        }
      } else {
        usuario = undefined;
      }
      return {
        temperatura: stats.temperatura,
        humedad: stats.humedad,
        usuario,
      };
    }
    return response.json();
  }
}
