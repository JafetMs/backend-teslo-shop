import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';

// console.log('Product entity:', Product);
// console.log('Product metadata:', Reflect.getMetadata('name', Product));

@Module({
  controllers: [ ProductsController ],
  providers: [ ProductsService ],
  imports: [
    TypeOrmModule.forFeature([ Product ])
  ]
})
export class ProductsModule {}
