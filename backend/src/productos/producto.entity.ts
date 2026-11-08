import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal')
  precio: number;

  @Column()
  categoria: string;

  // ✅ Imagen principal del producto
  @Column({ nullable: true })
  imagen: string;

  // ✅ Array de videos — soporta múltiples videos sin límite
  @Column('simple-array', { nullable: true })
  videos: string[];

  // ✅ Campos de oferta
  @Column({ default: false })
  enOferta: boolean;

  @Column('decimal', { nullable: true })
  precioOferta: number;

  @Column('int', { default: 0 })
  estrellas: number;

  @Column('int', { default: 0 })
  resenas: number;

  @Column('simple-array', { nullable: true })
  tallas: string[];

  @Column('simple-array', { nullable: true })
  colores: string[];

  @Column({ default: 'Entrega GRATIS 8-11 mayo' })
  envio: string;
}