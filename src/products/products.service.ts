import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
  
      const product = this.productRepository.create(createProductDto);
  
      await this.productRepository.save(product);
  
      return product;
    } catch (error: any) {
  
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: string) {

    const product = await this.productRepository.findBy({id});

    if(!product) {
       throw new BadRequestException(`Product with id: ${id} not found`)
    };

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {

    const { affected } = await this.productRepository.delete(id);

    if ( affected === 0) {
      throw new BadRequestException(`Product with id: ${id } not found`)
    }

    return  {
      ok: true,
      message: 'Product deleted succesfully'
    }

  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    // console.log(error);

    throw new InternalServerErrorException('Unexpected error, check the logs');
  }
}
