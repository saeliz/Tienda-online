import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  // ── DATOS DEL CLIENTE ──
  @Column()
  nombreCliente: string;

  @Column()
  telefono: string;

  @Column()
  direccion: string;

  // ── PRODUCTOS DEL PEDIDO ──
  // ✅ Guardamos el carrito completo como JSON
  @Column('text')
  productos: string;

  @Column('decimal')
  total: number;

  // ── PAGO CON YAPE ──
  // ✅ Ruta de la captura de pantalla del pago
  @Column({ nullable: true })
  capturaYape: string;

  // ── ESTADO DEL PEDIDO ──
  // pendiente | confirmado | enviado | entregado | cancelado
  @Column({ default: 'pendiente' })
  estado: string;

  // ✅ Fecha automática al crear el pedido
  @CreateDateColumn()
  fechaCreacion: Date;
}