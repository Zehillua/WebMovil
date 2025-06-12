import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from '../services/stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('locales')
  async obtenerLocales() {
    return this.statsService.obtenerLocales();
  }

  @Get('locales/:nombreLocal/estadisticas')
  async estadisticasLocal(@Param('nombreLocal') nombreLocal: string) {
    return this.statsService.estadisticasLocal(nombreLocal);
  }
}
