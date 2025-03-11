import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HasherGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { compare, hash } from 'bcryptjs';
export class BcryptHasher implements HasherGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }
  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
  
}
