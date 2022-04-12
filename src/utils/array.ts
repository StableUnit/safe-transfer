import BN from "bn.js";

export const sortByBalance = (arr: any[]) => arr.sort((a, b) => (new BN(a.balance).lt(new BN(b.balance)) ? 1 : -1));

export const sortBySymbol = (arr: any[]) => arr.sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
