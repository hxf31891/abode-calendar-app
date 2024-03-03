export const toDollars = (centValue: number | string | null): number | null => {
  const centNum = parseInt(String(centValue));
  if (!isNaN(centNum)) {
    return Number((centNum / 100).toFixed(2));
  } else {
    return null;
  }
};

export const toCents = (dollarValue: number | string | null): number | null => {
  const dollarNum = parseFloat(String(dollarValue));
  if (!isNaN(dollarNum)) {
    return parseInt(String(dollarNum * 100));
  } else {
    return null;
  }
};
