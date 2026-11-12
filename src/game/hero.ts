import { CharacterLook, SKINS } from '../art/Character';
import type { HeroLook } from './rules';

export const DEFAULT_SHIRT: Record<HeroLook['gender'], string> = {
  boy: '#F97316',
  girl: '#EC4899',
  hijab: '#14B8A6',
};

export function heroToLook(h: HeroLook): CharacterLook {
  const base: CharacterLook = {
    skin: SKINS[h.skin] ?? SKINS[1],
    shirt: h.shirt,
    pants: '#1E3A8A',
    hair: '#2B1B0E',
    hairStyle: 'short',
    hat: h.hat,
    cape: h.cape,
    mask: h.mask,
    star: h.star,
  };
  if (h.gender === 'girl') return { ...base, hairStyle: 'long', dress: true, pants: '#831843' };
  if (h.gender === 'hijab') return { ...base, hairStyle: 'hijab', hair: '#F9A8D4', dress: true, pants: '#0F766E' };
  return base;
}
