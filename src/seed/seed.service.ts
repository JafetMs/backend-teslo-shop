import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';
import { initialData } from './data/seed-data.js';
import { Product } from '../products/entities/product.entity.js';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ){}

  async runSeed() {

    await this.insertNewProducts();


    
    return 'Seed Exec'
  }
  

  private async insertNewProducts() {
    await this.productsService.deleeteAllProducts();

    const products = initialData.products;

    const insertPromises: Promise<Product>[] = [];

    await Promise.all(
  products.map(product => this.productsService.create(product)),
);


    return true;
  }
}
