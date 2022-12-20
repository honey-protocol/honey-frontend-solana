import { ReactNode } from 'react';

export interface HoneyButtonTabsProps {
  items: HoneyButtonTabsItem[];
  activeItemSlug: string;
  isFullWidth?: boolean;
  onClick: (itemSlug: string) => void;
}

type HoneyButtonTabsItem = {
  name: string | ReactNode;
  nameMobile?: string;
  nameTablet?: string;
  slug: string;
};
