export type OfferItem = {
  address: string;
  start: number;
  rate: number;
  end: number;
};

export type CounterOfferTabProps = {
  offers: OfferItem[];
};
