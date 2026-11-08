import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// ✅ Ruta relativa dentro de la misma carpeta
import { Pedido } from './pedido.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidosRepository: Repository<Pedido>,
  ) {}

  async create(pedido: Partial<Pedido>) {
    const nuevo = this.pedidosRepository.create(pedido);
    const guardado = await this.pedidosRepository.save(nuevo);
    await this.notificarWhatsApp(guardado);
    return guardado;
  }

  findAll() {
    return this.pedidosRepository.find({ order: { fechaCreacion: 'DESC' } });
  }

  findOne(id: number) { return this.pedidosRepository.findOneBy({ id }); }

  async updateEstado(id: number, estado: string) {
    await this.pedidosRepository.update(id, { estado });
    return this.pedidosRepository.findOneBy({ id });
  }

  private async notificarWhatsApp(pedido: Pedido) {
    try {
      const productos = JSON.parse(pedido.productos);
      const lista = productos.map((p: any) =>
        `• ${p.nombre} x${p.cantidad} — S/ ${(p.precio * p.cantidad).toFixed(2)}`
      ).join('\n');

      const mensaje =
        `🛍️ *NUEVO PEDIDO #${pedido.id}*\n\n` +
        `👤 *Cliente:* ${pedido.nombreCliente}\n` +
        `📞 *Teléfono:* ${pedido.telefono}\n` +
        `📍 *Dirección:* ${pedido.direccion}\n\n` +
        `📦 *Productos:*\n${lista}\n\n` +
        `💰 *Total: S/ ${pedido.total}*\n` +
        `💳 *Pago:* Yape`;

      const telefono = process.env.WHATSAPP_NUMERO || '51916044534';
      const apikey   = process.env.WHATSAPP_APIKEY  || '';

      if (!apikey) return; // ✅ No envía si no hay apikey configurada

      const url = `https://api.callmebot.com/whatsapp.php?phone=${telefono}&text=${encodeURIComponent(mensaje)}&apikey=${apikey}`;
      await fetch(url);
    } catch (err) {
      console.error('Error enviando WhatsApp:', err);
    }
  }
}