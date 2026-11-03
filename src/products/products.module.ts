import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { Product, ProductImage } from './entities/index.js'

// console.log('Product entity:', Product);
// console.log('Product metadata:', Reflect.getMetadata('name', Product));

@Module({
  controllers: [ ProductsController ],
  providers: [ ProductsService ],
  imports: [
    TypeOrmModule.forFeature([ Product,ProductImage ],),
    AuthModule
  ],
  exports: [
    ProductsService,
    TypeOrmModule
  ]
})
export class ProductsModule {}
