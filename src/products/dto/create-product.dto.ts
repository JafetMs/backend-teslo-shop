
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  /**
   * Product name.
   *
   * @example "Classic T-Shirt"
   */
  @ApiProperty({
    description: 'Product name.',
    example: 'Classic T-Shirt',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  /**
   * Product price.
   *
   * @example 599.99
   */
  @ApiPropertyOptional({
    description: 'Product price.',
    example: 599.99,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  /**
   * Product description.
   *
   * @example "Classic cotton t-shirt."
   */
  @ApiPropertyOptional({
    description: 'Product description.',
    example: 'Classic cotton t-shirt.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * URL-friendly product identifier.
   *
   * @example "classic-t-shirt"
   */
  @ApiPropertyOptional({
    description: 'URL-friendly product identifier.',
    example: 'classic-t-shirt',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  /**
   * Available product stock.
   *
   * @example 25
   */
  @ApiPropertyOptional({
    description: 'Available product stock.',
    example: 25,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  /**
   * Available product sizes.
   *
   * @example ["S", "M", "L", "XL"]
   */
  @ApiProperty({
    description: 'Available sizes for the product.',
    example: ['S', 'M', 'L', 'XL'],
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  /**
   * Product target gender.
   *
   * @example "unisex"
   */
  @ApiProperty({
    description: 'Target gender for the product.',
    example: 'unisex',
    enum: ['men', 'woman', 'kind', 'unisex'],
  })
  @IsIn(['men', 'woman', 'kind', 'unisex'])
  gender: string;

  /**
   * Product tags.
   *
   * @example ["shirt", "cotton", "casual"]
   */
  @ApiPropertyOptional({
    description: 'Tags associated with the product. Duplicate values are not allowed.',
    example: ['shirt', 'cotton', 'casual'],
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  @ArrayUnique()
  @IsOptional()
  tags?: string[];

  /**
   * Product image URLs.
   *
   * @example ["https://example.com/image-1.jpg"]
   */
  @ApiPropertyOptional({
    description: 'URLs of the product images.',
    example: ['https://example.com/image-1.jpg'],
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  @ArrayUnique()
  @IsOptional()
  images?: string[];
}
