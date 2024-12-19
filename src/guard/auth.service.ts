import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

type verifyJwt = {
  exp: number; iat: number; type: string; jti: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService = new JwtService(),
  ) { }

  async generateJwt(payload: object | Buffer, options?: JwtSignOptions): Promise<string> {
    return await this.jwtService.signAsync(payload, options)
  }

  async verifyJwt(token: string, options?: JwtVerifyOptions): Promise<verifyJwt> {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.SECRET_KEY,
      ...options
    })
  }
}