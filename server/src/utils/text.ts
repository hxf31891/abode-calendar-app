export const currencyize = (dollarValue: number | string): string | null => {
  const dollarNum = parseFloat(String(dollarValue));
  if (!isNaN(dollarNum)) {
    return `${dollarValue.toLocaleString(undefined, { currency: "USD", style: "currency" })}`;
  } else {
    return null;
  }
};

export const titlizeAll = (str: string): string => {
  const strArr = str.toLowerCase().replaceAll("_", " ").replaceAll("-", " ").split(" ");
  const titlizedArr = strArr.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1));
  return titlizedArr.join(" ");
};

export const titlize = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().replace("_", " ") : "";

export const snakify = (str: string): string => str.toLowerCase().replaceAll(" ", "_");

export const arrayToString = (arr: string[]): string => String(arr).replaceAll(",", ", ");

export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const formatName = (first: string, last: string): string => {
  if (first) {
    if (last) {
      return `${first} ${last}`;
    } else {
      return first;
    }
  } else if (last) {
    return last;
  } else {
    return "";
  }
};
