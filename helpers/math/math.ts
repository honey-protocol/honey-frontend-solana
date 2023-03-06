import Decimal from 'decimal.js';

export const lamportsToNumber = (
  value: Decimal | string | number,
  decimals: number
): number => {
  const valueDecimal = new Decimal(value);
  const factor = 10 ** decimals;
  return new Decimal(valueDecimal).div(factor).toNumber();
};

export const numberToLamports = (
  value: Decimal | number | string,
  decimals: number
): Decimal => {
  const factor = 10 ** decimals;
  return new Decimal(value).mul(factor);
};

export const roundTwoDecimalsUp = (debt: number, decimals: number) => {
    return Math.ceil(debt * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
