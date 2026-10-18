import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { PaginationDto } from '../common/dtos/pagination.dto.js';
import { isUUID } from 'class-validator';

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

  async findAll({ limit = 10, offset = 0} : PaginationDto) {
    return await this.productRepository.find({
      take:limit,
      skip: offset

      // Todo: relations
    });
  }

  async findOne(term: string) {

    let product : Product | null = null;

    if( isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term});

    }else{
      const queryBuilder = this.productRepository.createQueryBuilder();
      console.log(term)
      product = await queryBuilder
      .where(`LOWER(title) = :title or slug =:slug`,{
        title: term.toLowerCase(),
        slug: term,

      }).getOne();

    }

    if(!product) {
       throw new NotFoundException(`Product with term: ${term} not found`)
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
