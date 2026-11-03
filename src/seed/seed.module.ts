import { Module } from '@nestjs/common';
import { SeedService } from './seed.service.js';
import { SeedController } from './seed.controller.js';
import { ProductsModule } from '../products/products.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, TypeOrmModule, AuthModule],
})
export class SeedModule {}
