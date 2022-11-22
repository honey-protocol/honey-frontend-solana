import { ReactNode } from 'react';

export interface HoneyLinkProps {
  link: string;
  children: ReactNode;
  target?: string;
  className?: string;
}