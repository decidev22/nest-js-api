import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { domainToASCII } from "url";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async signup(dto: AuthDto) {
        //step 1 : Generate PW hash
        const hash= await argon.hash(dto.password);
        //step 2 : save the new user in db
        try {
            const user= await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash, 
                },
            });
            
            delete user.hash;
            //step 3 : return the saved user
            return user;
        } catch(error)
        {
            if(error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2002')
                    throw new ForbiddenException('Credential is taken already',);
            }
            throw error;
        }
        //return {msg: 'I have signed up'};
    }


    async signin(dto: AuthDto) {
        //find user by email upon sign in
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        //if no user -> exception
        if (!user) throw new ForbiddenException('Credentials incorrect',);
        //if password incorrect -> exception
        const pwMatches = await argon.verify(user.hash, dto.password);
        if (!pwMatches) throw new ForbiddenException('Password Incorrect',);
        //send back the user
        delete user.hash;
        return user;
        //return {msg: 'I have signed in'};
    }
}
