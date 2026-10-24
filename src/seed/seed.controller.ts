import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service.js';
import { CreateSeedDto } from './dto/create-seed.dto.js';
import { UpdateSeedDto } from './dto/update-seed.dto.js';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  
  @Get()
  executeSeed() {
    return this.seedService.runSeed()
  }
}
