import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { ChangeLedStateDto } from './dto/change-state.dto';
import { Esp32Auth } from './auth/decorators/esp32auth.decorator';
import { AppGateway } from './app.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appGateway: AppGateway,
  ) {}

  @Get('leds')
  getLeds() {
    return this.appService.getLeds();
  }

  //Ruta para que el ESP32 notifique el cambio de estados de los leds
  @Esp32Auth()
  @Put('leds/notificar')
  actualizarEstado(@Body() changeLedStateDto: ChangeLedStateDto) {
    this.appGateway.emitLedUpdate(
      changeLedStateDto.ledName,
      changeLedStateDto.state,
    );
    return;
    //return this.appService.actualizarEstado(changeLedStateDto);
  }

  @Put('leds')
  changeState(@Body() changeLedStateDto: ChangeLedStateDto) {
    return this.appService.changeLedState(changeLedStateDto);
  }

  @Get('stats')
  getStats() {
    return this.appService.getStats();
  }
}
