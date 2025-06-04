import { PiCoinVerticalFill } from "react-icons/pi";
import { HiBanknotes } from "react-icons/hi2"; // Corrected import for HiBanknotes
import { FetchCashInInventoryType } from "@/services/types/admin-service";

interface Props {
  cashInInventoryData: FetchCashInInventoryType[]; // Define the type of the prop
}

const CashInInventory = ({ cashInInventoryData }: Props) => {
  return (
    <div className="fixed left-4 top-4 bg-pink-200 rounded-lg shadow-lg flex items-center justify-center p-4">
      {cashInInventoryData && cashInInventoryData.length > 0 ? (
        <div className="">
          <h2 className="text-lg font-semibold">เงินสดในตู้</h2>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {cashInInventoryData.map((item) => (
              <div key={item.id} className="bg-white p-2 rounded-lg shadow">
                <div className="flex gap-2 items-center mb-2">
                  {item.mas_cash.type === "coin" && (
                    <PiCoinVerticalFill className="text-2xl" />
                  )}
                  {item.mas_cash.type === "bank_note" && (
                    <HiBanknotes className="text-2xl" />
                  )}

                  <p>{item.mas_cash.value}</p>
                </div>
                <p className="text-base text-gray-500">
                  จำนวน: {item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-lg font-semibold">ไม่มีเงินสดในตู้</h2>{" "}
          {/* Updated message */}
        </div>
      )}
    </div>
  );
};

export default CashInInventory;
