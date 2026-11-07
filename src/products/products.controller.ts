import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PaginationDto } from '../common/dtos/pagination.dto.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { ValidRoles } from '../auth/interfaces/valid-roles.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { userInfo } from 'os';
import { User } from '../auth/entities/user.entity.js';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity.js';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth( ValidRoles.user)
 @ApiResponse({
    status: 201,
    description: 'Product successfully created.',
    type: Product
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid product data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. The user does not have the required role.',
  })
  create(@Body() createProductDto: CreateProductDto,
  @GetUser() user: User
) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
   @ApiOperation({
    summary: 'Get all products',
    description: 'Returns a paginated list of products.',
  })
  @ApiResponse({
    status: 200,
    description: 'Products successfully retrieved.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid pagination parameters.',
  })
  findAll( @Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({
    summary: 'Find a product',
    description: 'Finds a product by its ID, slug, or search term.',
  })
  @ApiParam({
    name: 'term',
    description: 'Product identifier or search term.',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({
    summary: 'Update a product',
    description: 'Updates an existing product. Only administrators can perform this operation.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID.',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid product data or UUID.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Administrator role is required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  update(@Param('id',ParseUUIDPipe) id: string, 
  @Body() updateProductDto: UpdateProductDto,
  @GetUser() user: User
) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
@ApiOperation({
    summary: 'Delete a product',
    description: 'Deletes an existing product. Only administrators can perform this operation.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID.',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication is required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Administrator role is required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
