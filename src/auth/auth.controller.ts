import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service.js';
import { CreateUserDto, LoginUserDto } from './dto/index.js';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
      return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
      return this.authService.login(loginUserDto);
  }


  @Get()
  @UseGuards( AuthGuard())
  testingPrivateRoute() {


    return {
        Ok: true,
        messages: "hello world private",
         user: {
          name:'Fernando'
         }
    }
  }

 
}
