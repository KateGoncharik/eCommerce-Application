export const getPriceInUsd = (price: number | undefined): string => `$${(Number(price) / 100).toFixed(2)}`;
