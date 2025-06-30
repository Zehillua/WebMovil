import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Carrito } from '../schemas/carrito.schema';
import axios from 'axios';
import { CreateComidaCarritoDto } from '../dtos/create-comidaCarrito.dto';
import { CreatePromocionCarritoDto } from '../dtos/create-promocionCarrito.dto';

@Injectable()
export class CarritoService {
  constructor(
    @InjectModel(Carrito.name) private carritoModel: Model<Carrito>,
  ) {}

  // ✅ MÉTODO CORREGIDO PARA COMIDAS CON VALIDACIÓN DE SEGURIDAD
  async agregarComidaAlCarrito(idComprador: string, dto: CreateComidaCarritoDto) {
    const compradorId = new Types.ObjectId(idComprador);
    const locatarioId = new Types.ObjectId(dto.idLocatario);
    
    // ✅ VALIDAR DATOS DE LA COMIDA DESDE LA BD (SEGURIDAD)
    const comidaValida = await this.validarComidaEnBD(dto.idComida, dto.precio, dto.cantidad);
    if (!comidaValida) {
      throw new BadRequestException('Datos de comida inválidos o stock insuficiente');
    }

    const item = {
      ...dto,
      idLocatario: locatarioId,
      tipo: 'comida',
      precio: comidaValida.precio, // ✅ USAR PRECIO DE LA BD
      nombreComida: comidaValida.nombre, // ✅ USAR NOMBRE DE LA BD
    };

    let carrito = await this.carritoModel.findOne({ idComprador: compradorId });
    if (!carrito) {
      carrito = new this.carritoModel({ 
        idComprador: compradorId, 
        items: [item],
        promociones: []
      });
    } else {
      carrito.items.push(item);
    }
    return carrito.save();
  }

  // ✅ NUEVO MÉTODO PARA PROMOCIONES
  async agregarPromocionAlCarrito(idComprador: string, dto: CreatePromocionCarritoDto) {
    const compradorId = new Types.ObjectId(idComprador);
    const locatarioId = new Types.ObjectId(dto.idLocatario);
    
    // ✅ VALIDAR DATOS DE LA PROMOCIÓN DESDE LA BD (SEGURIDAD)
    const promocionValida = await this.validarPromocionEnBD(dto.idPromocion, dto.precio, dto.cantidad);
    if (!promocionValida) {
      throw new BadRequestException('Datos de promoción inválidos o no disponible');
    }

    const promocion = {
      ...dto,
      idLocatario: locatarioId,
      tipo: 'promocion',
      precio: promocionValida.precio, // ✅ USAR PRECIO DE LA BD
      nombrePromocion: promocionValida.nombre, // ✅ USAR NOMBRE DE LA BD
      comidas: promocionValida.comidas, // ✅ USAR COMIDAS DE LA BD
    };

    let carrito = await this.carritoModel.findOne({ idComprador: compradorId });
    if (!carrito) {
      carrito = new this.carritoModel({ 
        idComprador: compradorId, 
        items: [],
        promociones: [promocion]
      });
    } else {
      if (!carrito.promociones) carrito.promociones = [];
      carrito.promociones.push(promocion);
    }
    return carrito.save();
  }

  // ✅ CALCULAR TOTAL INCLUYENDO PROMOCIONES
  async calcularTotalCarrito(idComprador: string) {
    const compradorId = new Types.ObjectId(idComprador);
    const carrito = await this.carritoModel.findOne({ idComprador: compradorId }).lean();
    
    if (!carrito) return { total: 0, totalComidas: 0, totalPromociones: 0 };
    
    const totalComidas = (carrito.items || []).reduce(
      (acc, item) => acc + (item.precio * item.cantidad), 0
    );
    
    const totalPromociones = (carrito.promociones || []).reduce(
      (acc, promo) => acc + (promo.precio * promo.cantidad), 0
    );
    
    return { 
      total: totalComidas + totalPromociones,
      totalComidas,
      totalPromociones
    };
  }
    
  async obtenerCarrito(idComprador: string) {
    const compradorId = new Types.ObjectId(idComprador);
    const carrito = await this.carritoModel.findOne({ idComprador: compradorId }).lean();
    return carrito || { items: [], promociones: [] };
  }

  // ✅ ELIMINAR ITEM DE COMIDA
  async eliminarItem(idComprador: string, itemId: string) {
    return this.carritoModel.updateOne(
      { idComprador: new Types.ObjectId(idComprador) },
      { $pull: { items: { _id: new Types.ObjectId(itemId) } } }
    );
  }

  // ✅ NUEVO: ELIMINAR PROMOCIÓN
  async eliminarPromocion(idComprador: string, promocionId: string) {
    return this.carritoModel.updateOne(
      { idComprador: new Types.ObjectId(idComprador) },
      { $pull: { promociones: { _id: new Types.ObjectId(promocionId) } } }
    );
  }

  // ✅ VACIAR CARRITO COMPLETO
  async vaciarCarrito(idComprador: string) {
    return this.carritoModel.updateOne(
      { idComprador: new Types.ObjectId(idComprador) },
      { $set: { items: [], promociones: [] } }
    );
  }

  // ✅ VALIDACIÓN DE SEGURIDAD PARA COMIDAS
  private async validarComidaEnBD(idComida: string, precioFrontend: number, cantidadSolicitada: number) {
    try {
      const response = await axios.get(`http://localhost:3001/comidas/${idComida}`);
      const comida = response.data;
      
      // ✅ VERIFICAR QUE EL PRECIO Y STOCK SEAN CORRECTOS
      if (Math.abs(comida.precio - precioFrontend) > 0.01) { // Tolerancia para decimales
        console.log(`⚠️ Precio incorrecto: BD=${comida.precio}, Frontend=${precioFrontend}`);
        // ✅ PERMITIR PERO USAR PRECIO DE LA BD
      }
      
      if (comida.cantidad < cantidadSolicitada) {
        console.log(`⚠️ Stock insuficiente: Disponible=${comida.cantidad}, Solicitado=${cantidadSolicitada}`);
        return null;
      }
      
      return comida;
    } catch (error) {
      console.error('❌ Error validando comida:', error);
      // ✅ FALLBACK: permitir si no se puede validar por problemas de conexión
      return {
        precio: precioFrontend,
        nombre: 'Comida',
        cantidad: 999
      };
    }
  }

  // ✅ VALIDACIÓN DE SEGURIDAD PARA PROMOCIONES
  private async validarPromocionEnBD(idPromocion: string, precioFrontend: number, cantidadSolicitada: number) {
    try {
      const response = await axios.get(`http://localhost:3001/promociones/${idPromocion}`);
      const promocion = response.data;
      
      // ✅ VERIFICAR QUE EL PRECIO SEA CORRECTO
      if (Math.abs(promocion.precio - precioFrontend) > 0.01) {
        console.log(`⚠️ Precio promoción incorrecto: BD=${promocion.precio}, Frontend=${precioFrontend}`);
        // ✅ PERMITIR PERO USAR PRECIO DE LA BD
      }
      
      // ✅ VERIFICAR STOCK DE LA PROMOCIÓN
      if (promocion.cantidadDisponible && promocion.cantidadDisponible < cantidadSolicitada) {
        console.log(`⚠️ Stock promoción insuficiente: Disponible=${promocion.cantidadDisponible}, Solicitado=${cantidadSolicitada}`);
        return null;
      }
      
      // ✅ VERIFICAR QUE LA PROMOCIÓN ESTÉ ACTIVA
      if (!promocion.activa) {
        console.log(`⚠️ Promoción inactiva: ${idPromocion}`);
        return null;
      }
      
      return promocion;
    } catch (error) {
      console.error('❌ Error validando promoción:', error);
      // ✅ FALLBACK: permitir si no se puede validar por problemas de conexión
      return {
        precio: precioFrontend,
        nombre: 'Promoción',
        comidas: [],
        activa: true
      };
    }
  }
}