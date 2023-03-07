import {PortfolioCompany} from '@investool/engine';

export type Hidden = {
  hidden: boolean;
}

export type UiPortfolioCompany = PortfolioCompany & Hidden & {
  hasMagic: boolean;
};

declare global {
  interface Window {
    standalone?: {
      baseUrl: string
    };
  }
}