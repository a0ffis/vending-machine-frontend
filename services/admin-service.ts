import api, { ResponseData } from "@/config/axios";
import { CashType, FetchCashInInventoryType } from "./types/admin-service";

export const fetchCashInInventory = async (params: {}): Promise<
  FetchCashInInventoryType[]
> => {
  try {
    const response = await api.get<ResponseData<FetchCashInInventoryType[]>>(
      "/admin/cash-in-vending-machine",
      {
        params: {
          ...params,
        },
      },
    );

    console.log("Fetched products:", response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchMasCash = async (params: {}): Promise<CashType[]> => {
  try {
    const response = await api.get<ResponseData<CashType[]>>(
      "/admin/master/cash",
      {
        params: {
          ...params,
        },
      },
    );

    console.log("Fetched mas cash:", response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching mas cash:", error);
    throw error;
  }
};
