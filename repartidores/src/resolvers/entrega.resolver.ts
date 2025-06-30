import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { EntregaService } from '../services/entrega.service';
import { EntregaType, EstadisticasType } from '../types/entrega.types';
import { Entrega } from '../schemas/entrega.schema';

@Resolver(() => EntregaType)
export class EntregaResolver {
  constructor(private readonly entregaService: EntregaService) {}

  @Mutation(() => EntregaType)
  async actualizarValoracionEntrega(
    @Args('repartidorId') repartidorId: string,
    @Args('valoracion') valoracion: number
  ): Promise<Entrega> {
    return this.entregaService.actualizarValoracionMasReciente(repartidorId, valoracion);
  }

  @Query(() => [EntregaType])
  async valoracionesRepartidor(@Args('repartidorId') repartidorId: string): Promise<Entrega[]> {
    return this.entregaService.obtenerEntregasConValoracion(repartidorId);
  }

  @Query(() => [EntregaType])
  async entregasRepartidor(@Args('repartidorId') repartidorId: string): Promise<Entrega[]> {
    return this.entregaService.obtenerEntregasRepartidor(repartidorId);
  }

  @Query(() => EstadisticasType)
  async estadisticasRepartidor(@Args('repartidorId') repartidorId: string): Promise<any> {
    const stats = await this.entregaService.obtenerEstadisticas(repartidorId);
    const promedioValoracion = await this.entregaService.calcularPromedioValoracion(repartidorId);
    
    return {
      ...stats,
      valoracionPromedio: promedioValoracion
    };
  }

  @Query(() => Number)
  async promedioValoracionRepartidor(@Args('repartidorId') repartidorId: string): Promise<number> {
    return this.entregaService.calcularPromedioValoracion(repartidorId);
  }
}