import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { CrearComidaDto } from '../dto/comida.input';
import { ComidaService } from '../services/comida.service';
import { ComidaType } from '../dto/comida.type'; // <-- Asegúrate de tener este archivo

@Resolver()
export class ComidaResolver {
  constructor(private readonly comidaService: ComidaService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ComidaType)
  async agregarComida(
    @Args('input') input: CrearComidaDto,
    @Context() context: any
  ) {
    const user = context.req.user;
    return this.comidaService.crearComida(user._id, input);
  }

}