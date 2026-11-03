import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity.js';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor (
    private readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const validRoles : string [] = this.reflector.get('roles', context.getHandler())

    if (! validRoles) return true;
    if ( validRoles.length === 0 ) return true;

    const req = context.switchToHttp().getRequest();
    const user: User = req.user;

    if ( !user) 
      throw new BadRequestException('Not user found');

    
    for ( const role of user.roles) {
      if( validRoles.includes( role)) {
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${user.fullName} neeed a valid roles: [${validRoles}]`
    )
  }
}
