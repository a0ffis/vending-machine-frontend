import api, { ResponseData } from "@/config/axios";
import {
  FetchProductsType,
  PostPurchaseResponseType,
  PostPurchaseType,
} from "./types/vending-service";

const mockProducts = [
  {
    id: "1",
    name: "Classic Soda",
    description: "Refreshing carbonated drink.",
    current_price: "20.00 THB",
    image_url: "http://localhost/soda_classic.jpg",
  },
  {
    id: "2",
    name: "Orange Juice",
    description: "Freshly squeezed orange juice.",
    current_price: "35.00 THB",
    image_url: "http://localhost/juice_orange.jpg",
  },
  {
    id: "3",
    name: "Bottled Water",
    description: "Pure drinking water.",
    current_price: "10.00 THB",
    image_url: "http://localhost/water_bottle.jpg",
  },
  {
    id: "4",
    name: "Energy Drink",
    description: "Boost your day!",
    current_price: "45.00 THB",
    image_url: "http://localhost/energy_drink.jpg",
  },
  {
    id: "5",
    name: "Coffee Can",
    description: "Ready-to-drink coffee.",
    current_price: "30.00 THB",
    image_url: "http://localhost/coffee_can.jpg",
  },
  {
    id: "6",
    name: "Milk Carton",
    description: "Fresh milk, 200ml.",
    current_price: "25.00 THB",
    image_url: "http://localhost/milk_carton.jpg",
  },
  {
    id: "7",
    name: "Green Tea",
    description: "Unsweetened green tea.",
    current_price: "28.00 THB",
    image_url: "http://localhost/green_tea.jpg",
  },
  {
    id: "8",
    name: "Sparkling Water",
    description: "Bubbly and refreshing.",
    current_price: "22.00 THB",
    image_url: "http://localhost/sparkling_water.jpg",
  },
  {
    id: "9",
    name: "Chocolate Bar",
    description: "Delicious milk chocolate.",
    current_price: "15.00 THB",
    image_url: "http://localhost/chocolate_bar.jpg",
  },
  {
    id: "10",
    name: "Chips (Small)",
    description: "Crunchy potato chips.",
    current_price: "18.00 THB",
    image_url: "http://localhost/chips_small.jpg",
  },
];

export const fetchProducts = async (params: {}): Promise<
  FetchProductsType[]
> => {
  try {
    const response = await api.get<ResponseData<FetchProductsType[]>>(
      "/products",
      {
        params: {
          ...params,
        },
      },
    );

    console.log("Fetched products:", response.data.data);

    return response.data.data;
    // return mockProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const postPurchase = async (
  data: PostPurchaseType,
): Promise<ResponseData<PostPurchaseResponseType>> => {
  try {
    const response = await api.post<ResponseData<PostPurchaseResponseType>>(
      "/purchase",
      {
        ...data,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error posting purchase:", error);
    throw error;
  }
};
