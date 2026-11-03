import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';
import { initialData } from './data/seed-data.js';
import { Product } from '../products/entities/product.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();

    await this.insertNewProducts(adminUser);

    return 'Seed Exec';
  }

  private async deleteTables() {
    await this.productsService.deleeteAllProducts();

    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];
    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleeteAllProducts();

    const products = initialData.products;

    const insertPromises: Promise<Product>[] = [];

    await Promise.all(
      products.map((product) => this.productsService.create(product, user)),
    );

    return true;
  }
}
