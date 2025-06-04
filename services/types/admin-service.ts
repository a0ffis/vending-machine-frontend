export type CashType = {
  id: string;
  value: number;
  type: "coin" | "bank_note";
  currency: string;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
};

export type FetchCashInInventoryType = {
  id: string;
  vending_machine_id: string;
  mas_cash_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  mas_cash: CashType;
};
