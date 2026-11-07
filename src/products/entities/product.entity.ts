import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './product.image.entity.js';
import { User } from '../../auth/entities/user.entity.js';

@Entity({ name: 'products'})
export class Product {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
    description: 'Product unique identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Classic T-Shirt',
    description: 'Product title',
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 599.99,
    description: 'Product price',
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'Classic cotton t-shirt',
    description: 'Product description',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'classic-t-shirt',
    description: 'Product slug',
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 25,
    description: 'Available product stock',
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    description: 'Available product sizes',
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['cotton', 'summer', 'casual'],
    description: 'Product tags',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty({
    description: 'Product images',
  })
  @OneToMany(() => ProductImage, 
  (productImage) => productImage.product,
  {  cascade: true, eager:true})
  images?: Relation<ProductImage[]>;


  @ApiProperty({
    description: 'User who created the product',
  })
  @ManyToOne(
    () => User,
    ( user) => user.product,
    {
      eager:true
    }
  )
  user: Relation<User>;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replaceAll("'", '');
  }
}