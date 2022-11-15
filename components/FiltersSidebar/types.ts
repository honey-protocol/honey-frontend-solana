import {DefaultOptionType} from "rc-select/es/Select";

export type LendP2PSidebarFooterProps = {
  firstButtonTitle: string,
  secondButtonTitle: string,
  counter: number,
  isDisableSecondButton: boolean,
  onClose: Function,
}

export type LendP2PFiltersTabProps = {
  tags: string[],
  totalRequestedRange: [number, number],
  totalSuppliedRange: [number, number]
  interestRange: [number, number],
  onChangeTotalRequestedRange: (value: [number, number]) => void,
  onChangeTotalSuppliedRange: (value: [number, number]) => void,
  onChangeInterestRange: (value: [number, number]) => void,
  rules: DefaultOptionType[],
  maxTotalRequest: number,
  minTotalRequest: number,
  maxInterest: number,
  minInterest: number,
  maxTotalSupplied: number,
  minTotalSupplied: number,
  selectedTags: string[],
  onChangeSelectedTags: (value: string[]) => void,
}

export type FiltersSidebarProps = {
  tags: string[],
  initParams: Record<string, number>,
  rules: DefaultOptionType[]
}