import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Res
} from '@nestjs/common';
import { FilesService } from './files.service.js';
import type { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers/index.js';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

   @Get('product/:imageName')
   findProductImage(
    @Res() res: Response, // Wait for manually response
    @Param('imageName') imageName: string
   ) {

       const path = this.filesService.getStaticProductImage(imageName);
       
       res.sendFile( path );
   }


  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fieldSize: 500}
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('Make sure that the file is an image');
    console.log({ FileInController: file });
    const secureUrl = `${ this.configService.get('HOST_API')}/files/product/${ file.filename} `;
    return { 
      secureUrl
    }
  }
}
