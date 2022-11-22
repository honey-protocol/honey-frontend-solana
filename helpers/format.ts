import React from 'react';

export const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export const numberFormatterMobile = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

export const formatNumber = {
  format: (val?: number): string => {
    if (!val) {
      return '0';
    }
    return numberFormatter.format(val);
  },

  formatMobile: (val?: number): string => {
    if (!val) {
      return '0';
    }
    return numberFormatterMobile.format(val);
  },

  /**
   * works like formatNumber.format but do not round number
   * formatRoundDown(66.6666) => 66.66
   * format(66.6666) => 66.67
   * @param value
   * @param decimals Significant decimals
   */
  formatRoundDown: (value: number, decimals = 3): string => {
    if (!value) {
      return '0';
    }
    const significantDigits =
      parseInt(value.toExponential().split('e-')[1]) || 0;
    const decimalsUpdated = (decimals || 0) + significantDigits - 1;
    decimals = Math.min(decimalsUpdated, value.toString().length);

    return numberFormatter.format(
      Math.floor(value * 10 ** decimals) / 10 ** decimals
    );
  },

  /**
   * Works as formatNumber.format but adds % at the end
   * @param val
   */
  formatPercent: (val?: number) => {
    return `${formatNumber.format(val)} %`;
  },

  /**
   * Works as formatNumber.formatPercent but prints integer value if it is possible
   * @param val
   * @param precision (default = 3)
   */
  formatPercentRounded: (val: number, precision = 3) => {
    const power = Math.pow(10, precision);
    const precisedValue = Math.round(val * power) / power;
    return Number.isInteger(precisedValue)
      ? `${precisedValue} %`
      : `${formatNumber.format(precisedValue)} %`;
  },

  /**
   * Works as formatNumber.format but adds $ at the start of the string
   * @param val
   */
  formatUsd: (val?: number) => {
    return `$ ${formatNumber.format(val)}`;
  },

  /**
   * Converts 1000 into 1K, 1 000 000 to 1M, 1 000 000 000 to 1B, etc
   * @param value
   * @param decimals
   */
  formatShortName: (value: number, decimals = 2): string => {
    if (value < 1000) {
      return String(formatNumber.format(value));
    }
    const templates = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' }
      // { value: 1e9, symbol: 'B' },
      // { value: 1e12, symbol: 'T' },
      // { value: 1e15, symbol: 'P' },
      // { value: 1e18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = templates
      .slice()
      .reverse()
      .find(it => {
        return value >= it.value;
      });
    return item
      ? formatNumber
          .formatRoundDown(value / item.value, decimals)
          .replace(rx, '$1') + item.symbol
      : '0';
  },

  formatToThousands: (value: number): string => {
    if (value < 1000) {
      return '0 k';
    }
    return `${Math.floor(value / 1000)} k`;
  },

  formatUsdMobile: (val?: number) => {
    return `$ ${formatNumber.formatMobile(val)}`;
    return `$ ${formatNumber.format(val)}`;
  },

  /**
   * Works as formatNumber.format but adds ◎ at the start of the string
   * @param val
   */
  formatSol: (val?: number) => {
    return `◎ ${formatNumber.format(val)}`;
  },

  /**
   * Parse a formatted number to a float.
   * @param {string} stringNumber - the localized number
   */
  parse: (stringNumber: string) => {
    const decimalSeparator = formatNumber
      .format(1.1)
      .replace(/\p{Number}/gu, '');

    const thousandSeparator = formatNumber
      .format(11111)
      .replace(/\p{Number}/gu, '')
      .replace(new RegExp('\\' + decimalSeparator, 'g'), '');

    return parseFloat(
      stringNumber
        .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
        .replace(new RegExp('\\' + decimalSeparator), '.')
    );
  },

  formatTokenInput: (input: string, decimals: number | undefined) => {
    const [integersValue, decimalsValue] = input.split('.');

    if (!decimalsValue || decimalsValue.length === 0) {
      return input;
    }

    return `${integersValue}.${decimalsValue.slice(0, decimals)}`;
  },
  formatTokenAllDecimals: (amount: number, decimals: number) => {
    if (amount <= 0) {
      return String(amount);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }).format(amount);
  }
};

/**
 * Convert long NFT name into short.
 * @param {string} nftName - full NFT name, consist of collection name + NFT number
 * @param {number} maxLength - max formatted name length, 10 by default
 */
export const formatNFTName = (nftName: string, maxLength = 10) => {
  if (nftName.length <= maxLength) {
    return nftName;
  }

  const nftNumber = nftName.match(/#\d+$/)?.[0] || '';
  const collectionName = nftNumber.length
    ? nftName.split(nftNumber)[0]
    : nftName;

  const splicedCollectionName = collectionName.slice(
    0,
    maxLength - nftNumber.length
  );
  return `${splicedCollectionName}...${nftNumber}`;
};

export const dateFromTimestamp = (timestamp: number | string) => {
  const time = new Date(timestamp);

  const date = time.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return `${date}`;
};

import { Fraction, Percent, ZERO } from '@saberhq/token-utils';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import JSBI from 'jsbi';

import { CURRENCY_INFO, CurrencyMarket } from './currencies';

export const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'short'
});

export const FORMAT_PERCENT: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 5,
  style: 'percent'
};

export const FORMAT_VOTE_PERCENT = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  style: 'percent'
});

export const fractionToFloat = (frac: Fraction): number => {
  if (JSBI.equal(frac.denominator, ZERO)) {
    return JSBI.greaterThan(frac.numerator, ZERO)
      ? Number.POSITIVE_INFINITY
      : JSBI.lessThan(frac.numerator, ZERO)
      ? Number.NEGATIVE_INFINITY
      : Number.NaN;
  }
  return parseFloat(frac.toFixed(10));
};

const ONE_BP = new Percent(1, 10_000);

export const formatPercent = (percent: Percent): string => {
  return percent.lessThan(ONE_BP)
    ? `${percent.toSignificant()}%`
    : fractionToFloat(percent.asFraction).toLocaleString(
        undefined,
        FORMAT_PERCENT
      );
};

export const formatPrecise = (percent: Percent): string => {
  return (fractionToFloat(percent.asFraction) * 100).toLocaleString(undefined, {
    maximumFractionDigits: 10
  });
};

export const FORMAT_DOLLARS: Intl.NumberFormatOptions = {
  currency: 'USD',
  style: 'currency'
};

export const FORMAT_DOLLARS_WHOLE: Intl.NumberFormatOptions = {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
};

export const formatCurrency = (
  amount: number,
  currency: CurrencyMarket,
  numberFormatOptions: Intl.NumberFormatOptions = {}
): string => {
  if (currency === CurrencyMarket.USD) {
    return amount.toLocaleString(undefined, {
      ...FORMAT_DOLLARS,
      ...numberFormatOptions
    });
  }
  const fmt = amount.toLocaleString(undefined, {
    minimumSignificantDigits: 4,
    ...numberFormatOptions
  });
  const info = CURRENCY_INFO[currency];
  const prefix = info.prefix;
  if (prefix) {
    return `${prefix}${fmt}`;
  }
  return `${fmt} ${info.symbol}`;
};

export const formatCurrencyWhole = (
  amount: number,
  currency: CurrencyMarket,
  numberFormatOptions: Intl.NumberFormatOptions = {}
): string => {
  if (currency === CurrencyMarket.USD) {
    return amount.toLocaleString(undefined, {
      ...FORMAT_DOLLARS_WHOLE,
      ...numberFormatOptions
    });
  }
  const fmt = amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...numberFormatOptions
  });
  const info = CURRENCY_INFO[currency];
  const prefix = info.prefix;
  if (prefix) {
    return `${prefix}${fmt}`;
  }
  return `${fmt} ${info.symbol}`;
};

export const formatCurrencySmart = (
  amount: number | Fraction,
  currency: CurrencyMarket,
  numberFormatOptions?: Intl.NumberFormatOptions
): string => {
  const amtFloat =
    amount instanceof Fraction ||
    (typeof amount === 'object' && (amount as Record<string, unknown>)?.toFixed)
      ? fractionToFloat(amount)
      : amount;
  const threshold =
    currency === CurrencyMarket.USD
      ? 100
      : currency === CurrencyMarket.BTC
      ? 100
      : 1;
  return amtFloat > threshold
    ? formatCurrencyWhole(amtFloat, currency, numberFormatOptions)
    : formatCurrency(amtFloat, currency, numberFormatOptions);
};

/**
 * @warning For end-user display purposes only. It loses precision and does rounding
 *
 * There is padding
 *
 * If (Whole number digits > softMaximumSignificantDigits)
 *   Rounds to whole number towards 0
 * Otherwise
 *   Defaults to token.decimals, but respects numberFormatOptions as an override
 *
 * Example for softMaximumSignificantDigits = 7 and token with 6 maxDigits
 *
 * 1234.87654321 => 1234.876 (7 significant figures)
 * 1234567.87654321 => 1234567 (rounded down)
 * 123456789.321 => 123456789
 * 1.87654321 => 1.876543
 */
export const formatDisplayWithSoftLimit = (
  float: number,
  maxDecimals: number,
  softMaximumSignificantDigits = 7,
  numberFormatOptions?: Intl.NumberFormatOptions,
  locale?: string
): string => {
  if (
    Number.isNaN(softMaximumSignificantDigits) ||
    softMaximumSignificantDigits <= 0
  ) {
    throw new Error('softMaximumSignificantDigits must be greater than 0');
  }

  // Round to integer if there are enough whole digits
  const dropDecimalsAfter = Math.pow(10, softMaximumSignificantDigits - 1);

  if (float >= dropDecimalsAfter) {
    // Round down to display integer amount
    const wholeNumberFormatOptions: Intl.NumberFormatOptions = Object.assign(
      {},
      numberFormatOptions,
      {
        maximumFractionDigits: 0
      }
    );
    return Math.floor(float).toLocaleString(locale, wholeNumberFormatOptions);
  }

  // Round to maxDecimals if too small
  const sigDerivedDigitsOnRight =
    softMaximumSignificantDigits - Math.floor(Math.log10(float)) - 1;

  const digitsOnRight = Math.max(
    0,
    Math.min(maxDecimals, sigDerivedDigitsOnRight)
  );
  const flooredToPrecision =
    Math.floor(float * 10 ** digitsOnRight) / 10 ** digitsOnRight;

  const maxFormatOptions: Intl.NumberFormatOptions = Object.assign(
    {
      minimumFractionDigits: digitsOnRight,
      maximumFractionDigits: digitsOnRight
    },
    numberFormatOptions
  );
  return flooredToPrecision.toLocaleString(locale, maxFormatOptions);
};

const SI_SUFFIXES = {
  t: 12,
  b: 9,
  m: 6,
  k: 3
};

export const formatNumberSI = (value: number): string => {
  const result = Object.entries(SI_SUFFIXES).find(([_, power]) => {
    return value >= 10 ** power;
  });
  if (!result) {
    return value.toLocaleString();
  }
  const [suffix, power] = result;
  const adjusted = value / 10 ** power;
  return `${adjusted.toLocaleString(undefined, {
    maximumSignificantDigits: 3
  })}${suffix}`;
};

export const formatDurationSeconds = (seconds: number) =>
  formatDuration(
    intervalToDuration({
      start: new Date(0),
      end: new Date(seconds * 1_000)
    }),
    { delimiter: ', ' }
  );

export const formatSignificantDistance = (end: Date, start: Date) =>
  formatDuration(
    intervalToDuration({
      start,
      end
    }),
    { delimiter: ', ' }
  )
    .split(', ')
    .slice(0, 3)
    .join(', ');

export const formatSignificantDistanceWithSuffix = (end: Date, start: Date) => {
  const fmt = formatSignificantDistance(end, start);
  return `${fmt} ${end < start ? 'after' : 'before'}`;
};
