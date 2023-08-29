import girlAvatar from '@icons/avatar-girl.png';
import boyAvatar from '@icons/avatar-boy.png';

export function getAvatarByGender(gender: string): HTMLImageElement {
  return gender === 'male' ? boyAvatar : girlAvatar;
}
