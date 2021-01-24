export enum Payments {
  ALL = "Выручка",
  CASH = "Наличные",
  CASHLESS = "Безналичный расчет",
  CREDIT = "Кредитные карты",
}

export interface ChartData {
  [Payments.ALL]: any;
  [Payments.CASH]: number;
  [Payments.CASHLESS]: number;
  [Payments.CREDIT]: number;
  averageСheck: number;
  averageGuest: number;
  removingFromCheck: number;
  removingFromBill: number;
  checksCount: number;
  guestsCount: number;
}

export interface Chart {
  day: string;
  data: ChartData;
}
