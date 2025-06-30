import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { VentaService } from '../services/venta.service';
import { VentaType } from '../types/venta.type';
import { RegistrarVentaInput } from '../dto/venta.input';

@Resolver(() => VentaType)
export class VentaResolver {
  constructor(private readonly ventaService: VentaService) {}

  @Mutation(() => VentaType)
  async registrarVenta(@Args('input') input: RegistrarVentaInput): Promise<any> {
    return this.ventaService.registrarVenta(input);
  }

  @Query(() => [VentaType])
  async ventasPorLocal(@Args('localId') localId: string): Promise<any[]> {
    return this.ventaService.obtenerVentasPorLocal(localId);
  }

  @Query(() => String) // Retorna JSON como string
  async estadisticasLocal(@Args('localId') localId: string): Promise<string> {
    const estadisticas = await this.ventaService.obtenerEstadisticasLocal(localId);
    return JSON.stringify(estadisticas);
  }
}