import { BinaryLike, createHash } from 'crypto';

export function shaHash(data: BinaryLike) {
  return createHash('sha256').update(data).digest('hex');
}
