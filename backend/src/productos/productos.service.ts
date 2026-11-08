import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// ✅ Ruta relativa dentro de la misma carpeta
import { Producto } from './producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  findAll() { return this.productosRepository.find(); }

  findOne(id: number) { return this.productosRepository.findOneBy({ id }); }

  findByCategoria(categoria: string) {
    return this.productosRepository.findBy({ categoria });
  }

  create(producto: Partial<Producto>) {
    const nuevo = this.productosRepository.create(producto);
    return this.productosRepository.save(nuevo);
  }

  async update(id: number, datos: Partial<Producto>) {
    await this.productosRepository.update(id, datos);
    return this.productosRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.productosRepository.delete(id);
    return { mensaje: 'Producto eliminado correctamente' };
  }
}