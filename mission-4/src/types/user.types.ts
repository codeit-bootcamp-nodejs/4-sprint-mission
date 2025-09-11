import type { userContentType } from '../validations/userSchema.js';

export interface EntityId {
  id: number;
}
export interface PatchUserData extends EntityId {
  data: {
    email?: string;
    nickname?: string;
    changePassword?: string;
    currentPassword?: string;
    image?: string;
  };
}
export interface getUserContent extends EntityId, userContentType {}
