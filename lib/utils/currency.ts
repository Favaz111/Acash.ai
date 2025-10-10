/**
 * Multi-Currency System
 * Real-time currency conversion with caching
 */

export type Currency = 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'KWD' | 'BHD' | 'OMR' | 'QAR';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  nameAr: string;
  flag: string;
  decimalPlaces: number;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  SAR: {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'Saudi Riyal',
    nameAr: 'ريال سعودي',
    flag: '🇸🇦',
    decimalPlaces: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    nameAr: 'دولار أمريكي',
    flag: '🇺🇸',
    decimalPlaces: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    nameAr: 'يورو',
    flag: '🇪🇺',
    decimalPlaces: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    nameAr: 'جنيه إسترليني',
    flag: '🇬🇧',
    decimalPlaces: 2,
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    nameAr: 'درهم إماراتي',
    flag: '🇦🇪',
    decimalPlaces: 2,
  },
  KWD: {
    code: 'KWD',
    symbol: 'د.ك',
    name: 'Kuwaiti Dinar',
    nameAr: 'دينار كويتي',
    flag: '🇰🇼',
    decimalPlaces: 3,
  },
  BHD: {
    code: 'BHD',
    symbol: 'د.ب',
    name: 'Bahraini Dinar',
    nameAr: 'دينار بحريني',
    flag: '🇧🇭',
    decimalPlaces: 3,
  },
  OMR: {
    code: 'OMR',
    symbol: 'ر.ع',
    name: 'Omani Rial',
    nameAr: 'ريال عماني',
    flag: '🇴🇲',
    decimalPlaces: 3,
  },
  QAR: {
    code: 'QAR',
    symbol: 'ر.ق',
    name: 'Qatari Riyal',
    nameAr: 'ريال قطري',
    flag: '🇶🇦',
    decimalPlaces: 2,
  },
};

export interface ExchangeRates {
  base: Currency;
  rates: Record<Currency, number>;
  lastUpdated: number;
}

// In-memory cache for exchange rates
let cachedRates: ExchangeRates | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Fixed Gulf exchange rates (relatively stable)
const GULF_FIXED_RATES: Partial<Record<Currency, Record<Currency, number>>> = {
  SAR: {
    SAR: 1,
    USD: 0.27, // 1 SAR = 0.27 USD
    AED: 0.98, // 1 SAR = 0.98 AED
    KWD: 0.082, // 1 SAR = 0.082 KWD
    BHD: 0.1, // 1 SAR = 0.10 BHD
    OMR: 0.1, // 1 SAR = 0.10 OMR
    QAR: 0.97, // 1 SAR = 0.97 QAR
    EUR: 0.25, // Approximate
    GBP: 0.21, // Approximate
  },
};

class CurrencyConverter {
  // Get exchange rates (with caching)
  async getExchangeRates(baseCurrency: Currency = 'SAR'): Promise<ExchangeRates> {
    // Check cache
    if (
      cachedRates &&
      cachedRates.base === baseCurrency &&
      Date.now() - cachedRates.lastUpdated < CACHE_DURATION
    ) {
      return cachedRates;
    }

    try {
      // Try to fetch from API
      if (process.env.NEXT_PUBLIC_EXCHANGE_API_KEY) {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/latest/${baseCurrency}`
        );
        const data = await response.json();

        if (data.result === 'success') {
          const rates: Record<Currency, number> = {} as any;
          Object.keys(CURRENCIES).forEach((currency) => {
            rates[currency as Currency] = data.conversion_rates[currency] || 1;
          });

          cachedRates = {
            base: baseCurrency,
            rates,
            lastUpdated: Date.now(),
          };

          return cachedRates;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch live exchange rates, using fixed rates:', error);
    }

    // Fallback to fixed rates
    return this.getFixedRates(baseCurrency);
  }

  // Get fixed exchange rates (offline fallback)
  private getFixedRates(baseCurrency: Currency): ExchangeRates {
    const baseRates = GULF_FIXED_RATES[baseCurrency] || GULF_FIXED_RATES.SAR!;
    const rates: Record<Currency, number> = {} as any;

    Object.keys(CURRENCIES).forEach((currency) => {
      rates[currency as Currency] = baseRates[currency as Currency] || 1;
    });

    cachedRates = {
      base: baseCurrency,
      rates,
      lastUpdated: Date.now(),
    };

    return cachedRates;
  }

  // Convert amount between currencies
  async convert(amount: number, fromCurrency: Currency, toCurrency: Currency): Promise<number> {
    if (fromCurrency === toCurrency) return amount;

    const rates = await this.getExchangeRates(fromCurrency);
    const rate = rates.rates[toCurrency];

    return amount * rate;
  }

  // Convert and format
  async convertAndFormat(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    options?: {
      showSymbol?: boolean;
      showCode?: boolean;
      locale?: 'ar' | 'en';
    }
  ): Promise<string> {
    const convertedAmount = await this.convert(amount, fromCurrency, toCurrency);
    return this.formatCurrency(convertedAmount, toCurrency, options);
  }

  // Format currency amount
  formatCurrency(
    amount: number,
    currency: Currency,
    options?: {
      showSymbol?: boolean;
      showCode?: boolean;
      locale?: 'ar' | 'en';
    }
  ): string {
    const { showSymbol = true, showCode = false, locale = 'ar' } = options || {};

    const currencyInfo = CURRENCIES[currency];
    const formattedNumber = amount.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      minimumFractionDigits: currencyInfo.decimalPlaces,
      maximumFractionDigits: currencyInfo.decimalPlaces,
    });

    let result = formattedNumber;

    if (showSymbol && showCode) {
      result =
        locale === 'ar'
          ? `${formattedNumber} ${currencyInfo.symbol} (${currencyInfo.code})`
          : `${currencyInfo.symbol}${formattedNumber} (${currencyInfo.code})`;
    } else if (showSymbol) {
      result =
        locale === 'ar'
          ? `${formattedNumber} ${currencyInfo.symbol}`
          : `${currencyInfo.symbol}${formattedNumber}`;
    } else if (showCode) {
      result = `${formattedNumber} ${currencyInfo.code}`;
    }

    return result;
  }

  // Get exchange rate between two currencies
  async getRate(fromCurrency: Currency, toCurrency: Currency): Promise<number> {
    if (fromCurrency === toCurrency) return 1;

    const rates = await this.getExchangeRates(fromCurrency);
    return rates.rates[toCurrency];
  }

  // Get all rates for a base currency
  async getAllRates(baseCurrency: Currency): Promise<Record<Currency, number>> {
    const rates = await this.getExchangeRates(baseCurrency);
    return rates.rates;
  }

  // Clear cache (force refresh)
  clearCache(): void {
    cachedRates = null;
  }
}

// Export singleton instance
export const currencyConverter = new CurrencyConverter();

// Helper functions
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCIES[currency]?.symbol || currency;
}

export function getCurrencyName(currency: Currency, locale: 'ar' | 'en' = 'ar'): string {
  const info = CURRENCIES[currency];
  return locale === 'ar' ? info?.nameAr : info?.name;
}

export function formatAmount(
  amount: number,
  currency: Currency = 'SAR',
  locale: 'ar' | 'en' = 'ar'
): string {
  return currencyConverter.formatCurrency(amount, currency, {
    showSymbol: true,
    locale,
  });
}

// Multi-currency price display
export async function getMultiCurrencyPrices(
  amount: number,
  baseCurrency: Currency = 'SAR',
  targetCurrencies: Currency[] = ['USD', 'EUR', 'AED']
): Promise<Record<Currency, { amount: number; formatted: string }>> {
  const result: Record<Currency, { amount: number; formatted: string }> = {} as any;

  for (const currency of targetCurrencies) {
    const convertedAmount = await currencyConverter.convert(amount, baseCurrency, currency);
    result[currency] = {
      amount: convertedAmount,
      formatted: currencyConverter.formatCurrency(convertedAmount, currency, {
        showSymbol: true,
        showCode: true,
      }),
    };
  }

  return result;
}

// Currency selector options
export function getCurrencyOptions(locale: 'ar' | 'en' = 'ar'): {
  value: Currency;
  label: string;
}[] {
  return Object.entries(CURRENCIES).map(([code, info]) => ({
    value: code as Currency,
    label: `${info.flag} ${locale === 'ar' ? info.nameAr : info.name} (${info.code})`,
  }));
}

// Popular Gulf currencies
export const GULF_CURRENCIES: Currency[] = ['SAR', 'AED', 'KWD', 'BHD', 'OMR', 'QAR'];

// International currencies
export const INTERNATIONAL_CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP'];

// All currencies grouped
export const CURRENCY_GROUPS = {
  gulf: GULF_CURRENCIES,
  international: INTERNATIONAL_CURRENCIES,
  all: Object.keys(CURRENCIES) as Currency[],
};

// Exchange rate change notification
export async function getExchangeRateChange(
  fromCurrency: Currency,
  toCurrency: Currency,
  previousRate: number
): Promise<{
  currentRate: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'stable';
}> {
  const currentRate = await currencyConverter.getRate(fromCurrency, toCurrency);
  const change = currentRate - previousRate;
  const changePercent = (change / previousRate) * 100;

  return {
    currentRate,
    change,
    changePercent,
    direction: change > 0.01 ? 'up' : change < -0.01 ? 'down' : 'stable',
  };
}

// Batch conversion for multiple amounts
export async function batchConvert(
  amounts: { amount: number; fromCurrency: Currency }[],
  toCurrency: Currency
): Promise<number[]> {
  const results = await Promise.all(
    amounts.map((item) => currencyConverter.convert(item.amount, item.fromCurrency, toCurrency))
  );
  return results;
}
