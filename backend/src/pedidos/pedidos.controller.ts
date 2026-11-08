import { Controller, Get, Post, Put, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PedidosService } from './pedidos.service';
import { Pedido } from './pedido.entity';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // GET /pedidos — lista todos los pedidos (para el admin)
  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  // GET /pedidos/1
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  // POST /pedidos — crea pedido nuevo
  @Post()
  create(@Body() pedido: Partial<Pedido>) {
    return this.pedidosService.create(pedido);
  }

  // POST /pedidos/upload-captura — sube captura de Yape
  @Post('upload-captura')
  @UseInterceptors(FileInterceptor('captura', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const nombre = 'yape-' + Date.now() + extname(file.originalname);
        cb(null, nombre);
      },
    }),
  }))
  subirCaptura(@UploadedFile() file: Express.Multer.File) {
    return { ruta: `/uploads/${file.filename}` };
  }

  // PUT /pedidos/1/estado — cambia estado del pedido
  @Put(':id/estado')
  updateEstado(@Param('id') id: string, @Body() body: { estado: string }) {
    return this.pedidosService.updateEstado(+id, body.estado);
  }
}