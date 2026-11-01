import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity.js";
import { JwtPayload } from "../interfaces/jwt-payload.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy ( Strategy ){

   constructor (
    @InjectRepository( User)
        private readonly userRepository : Repository<User>,

        configService : ConfigService
   ){
        super({
            secretOrKey : configService.getOrThrow<string>('JWT_SECRET'),
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
   }

   
    async validate ( { email} : JwtPayload) : Promise<User> {

        const user = await this.userRepository.findOneBy({email})

        if ( !user) throw new UnauthorizedException('Invalid token')

        if ( !user.isActive) throw new UnauthorizedException('User is inactive,talk with an admin')
        

        return user;
    }
}