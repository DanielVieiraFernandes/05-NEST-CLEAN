import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwt: JwtService) {}

  encrypt(payload: Record<string, unknown>) {
    return this.jwt.signAsync(payload);
  }
}
