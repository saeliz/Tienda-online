import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
// ✅ Rutas relativas dentro de la misma carpeta
import { ProductosService } from './productos.service';
import { Producto } from './producto.entity';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  findAll() { return this.productosService.findAll(); }

  @Get('categoria/:nombre')
  findByCategoria(@Param('nombre') nombre: string) {
    return this.productosService.findByCategoria(nombre);
  }

  // ✅ Upload endpoints ANTES de :id para evitar conflictos
  @Post('upload')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, Date.now() + extname(file.originalname));
      },
    }),
  }))
  subirImagen(@UploadedFile() file: Express.Multer.File) {
    return { ruta: `/uploads/${file.filename}` };
  }

  @Post('upload-videos')
  @UseInterceptors(FilesInterceptor('videos', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1000) + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      file.mimetype.startsWith('video/') ? cb(null, true) : cb(new Error('Solo videos'), false);
    },
  }))
  subirVideos(@UploadedFiles() files: Express.Multer.File[]) {
    return { rutas: files.map(f => `/uploads/${f.filename}`) };
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.productosService.findOne(+id); }

  @Post()
  create(@Body() producto: Partial<Producto>) { return this.productosService.create(producto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() datos: Partial<Producto>) {
    return this.productosService.update(+id, datos);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.productosService.remove(+id); }
}