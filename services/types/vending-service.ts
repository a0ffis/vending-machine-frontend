export type FetchProductsType = {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  current_price: number;
  quantity_in_stock: number;
  slot_number: string;
};

export type PostPurchaseType = {
  machine_product_id: string;
  quantity: number;
  inserted_cash: {
    mas_cash_id: string;
    quantity: number;
  }[];
};

type ChargeType = {
  mas_cash_id: string;
  value: number;
  quantity: number;
};

export type PostPurchaseResponseType = {
  message: string;
  transaction_id: string;
  change: ChargeType[];
  total_price: number;
  total_inserted_cash: number;
  machine_product_id: string;
  quantity_purchased: number;
  total_change_given: number;
};
