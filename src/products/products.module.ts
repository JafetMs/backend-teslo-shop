import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities/index.js'

// console.log('Product entity:', Product);
// console.log('Product metadata:', Reflect.getMetadata('name', Product));

@Module({
  controllers: [ ProductsController ],
  providers: [ ProductsService ],
  imports: [
    TypeOrmModule.forFeature([ Product,ProductImage ])
  ],
  exports: [
    ProductsService,
    TypeOrmModule
  ]
})
export class ProductsModule {}
