export type OfferItem = {
  hash: string,
  date: string,
  rate: number,
  endDate: string,
}

export type CounterOfferTabProps = {
  token: string,
  price: number,
  offers: OfferItem[]
}