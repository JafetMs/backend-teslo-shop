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
import { PaginationDto } from '../common/dtos/pagination.dto.js';
import { isUUID } from 'class-validator';
import { Product, ProductImage } from './entities/index.js';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository <ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {

      const { images = [], ...productDetails } = createProductDto
      const product = this.productRepository.create({
        
        ...productDetails,
        images : images.map( image => this.productImageRepository.create({ url:image}))
      });

      await this.productRepository.save(product);

      return { ...product, images}
    } catch (error: any) {
      this.handleExceptions(error);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const products =  await this.productRepository.find({
      take: limit,
      skip: offset,

      // Todo: relations
      relations:{
        images: true
      }
    });

    return products.map( product => ({
      ...product,
      images: product.images?.map( img => img.url)
    }));
  }

  async findOne(term: string) {
    let product: Product | null = null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // Here I use Query Builder
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`LOWER(title) = :title or slug =:slug`, {
          title: term.toLowerCase(),
          slug: term,
        })
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with term: ${term} not found`);
    }
    return {
      ...product,
      images: product.images?.map(img => img.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {


    const { images, ...toUpdate}  = updateProductDto;
    const product = await this.productRepository.preload({id,...toUpdate});

    if (!product) throw new NotFoundException(`Product with ${id} not found`);

    // Create query runner;
    const queryRunner  = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {


    if (images) {
        await queryRunner.manager.delete(
          ProductImage,
          { product :  id}
        )

        product.images = images.map( 
          img => this.productImageRepository.create({url: img} )
        )
    } else {


    }

      await queryRunner.manager.save( product );
      // await this.productRepository.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return product;
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { affected } = await this.productRepository.delete(id);

    if (affected === 0) {
      throw new BadRequestException(`Product with id: ${id} not found`);
    }

    return {
      ok: true,
      message: 'Product deleted succesfully',
    };
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
