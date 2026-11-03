import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service.js';
import { CreateUserDto, LoginUserDto } from './dto/index.js';
import { GetUser } from './decorators/get-user.decorator.js';
import { User } from './entities/user.entity.js';
import { getRawHeaders } from './decorators/raw-headers.decorators.js';
import { UserRoleGuard } from './guards/user-role.guard.js';
import { RoleProtected } from './decorators/role-protected.decorator.js';
import { ValidRoles } from './interfaces/valid-roles.js';
import { Auth } from './decorators/auth.decorator.js';



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

  @Get('check-status')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  checkAuthStatus(  
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user)
  }


  @Get()
  @UseGuards( AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user:User, 
    @GetUser('email') user1:string ,
    @getRawHeaders() rawHeaders: string[]
  ) {


    return {
        Ok: true,
        messages: "hello world private",
        user,
        user1,
        rawHeaders
         
    }
  }
  // @SetMetadata('roles',['admin','super-user'])

  @Get('priv2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard)
  privateteRoute2(
    @GetUser() user: User
  ){
    return {
      oki: true,
      user
    };
  }

  @Get('priv3')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  privateteRoute3(
    @GetUser() user: User
  ){
    return {
      oki: true,
      user
    };
  }
 
}
