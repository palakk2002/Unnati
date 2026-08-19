import { BannerPosition } from '../../../../types/banner';

/** Wide promo banners — use contain so uploaded art is not cropped on mobile. */
export const BANNER_ASPECT_CLASS: Partial<Record<BannerPosition | string, string>> = {
  'Main Banner': 'aspect-[1.8/1] md:aspect-[3.3/1]',
  HOME_MAIN_SLIDER: 'aspect-[1.8/1] md:aspect-[3.3/1]',
  'Main Section Banner': 'aspect-[1.8/1] md:aspect-[3.3/1]',
  'Footer Banner': 'aspect-[1.8/1] md:aspect-[3.3/1]',
  'Flash Deals': 'aspect-[1.8/1] md:aspect-[3.3/1]',
  'Deal of the Day': 'aspect-[1.8/1] md:aspect-[3.3/1]',
};

export const DEFAULT_BANNER_ASPECT = 'aspect-[1.8/1] md:aspect-[3.3/1]';

export function getBannerAspectClass(position: BannerPosition | string): string {
  return BANNER_ASPECT_CLASS[position] || DEFAULT_BANNER_ASPECT;
}
