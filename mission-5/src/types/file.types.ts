import type { EntityId, UserId } from './shared.type.js';

export interface ImagePath {
  path: string;
}
export interface PostImage extends ImagePath, UserId {}

export interface FileParams extends UserId, EntityId {}
