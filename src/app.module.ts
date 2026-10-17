import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module.js';
import { CommonModule } from './common/common.module.js';

@Module({
  imports: [ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type:'postgres',
      database:process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: +( process.env.DB_PORT  || 5433),
      username:process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      entities: [],
      // logging: ['query', 'error', 'schema'],
    }),

    ProductsModule,

    CommonModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
