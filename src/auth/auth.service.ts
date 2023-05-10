import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { domainToASCII } from 'url';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    //step 1 : Generate PW hash
    const hash = await argon.hash(dto.password);
    //step 2 : save the new user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      //delete user.hash;
      //step 3 : return the saved user
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Credential is taken already');
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
    if (!user) throw new ForbiddenException('Credentials incorrect');
    //if password incorrect -> exception
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Password Incorrect');
    //send back the user
    //delete user.hash;
    return this.signToken(user.id, user.email);
    //return {msg: 'I have signed in'};
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
