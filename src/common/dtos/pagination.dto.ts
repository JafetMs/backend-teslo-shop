
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  /**
   * Maximum number of records to return.
   *
   * @example 10
   */
  @ApiPropertyOptional({
    description: 'Maximum number of records to return.',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  /**
   * Number of records to skip before returning results.
   *
   * @example 0
   */
  @ApiPropertyOptional({
    description: 'Number of records to skip before returning results.',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
