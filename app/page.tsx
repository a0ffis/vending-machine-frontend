"use client";
import Layout from "@/components/layout";
import { useCashInInventory, useMasCash } from "@/hooks/admin-service";
import { useProductList } from "@/hooks/vending-service";
import {
  FetchProductsType,
  PostPurchaseResponseType,
  PostPurchaseType,
} from "@/services/types/vending-service";
import {
  Card,
  Carousel,
  Empty,
  Spin,
  Modal,
  Button,
  InputNumber,
  message,
  notification,
} from "antd";
import Image from "next/image";
import { useState } from "react";
import { PiCoinVerticalFill } from "react-icons/pi";
import { HiBanknotes } from "react-icons/hi2"; // Corrected import for HiBanknotes
import { postPurchase } from "@/services/vending-service";

const { Meta } = Card;

export default function Home() {
  const {
    data = [],
    error,
    isLoading,
    refetch: refetchProductList,
  } = useProductList();
  const { refetch: refetchCashInventory } = useCashInInventory();
  const { data: masCashData = [] } = useMasCash();

  // State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<FetchProductsType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [chargeModalVisible, setChargeModalVisible] = useState(false);
  const [chargeModalData, setChargeModalData] = useState<
    PostPurchaseResponseType["change"]
  >([]);

  const [insertedCash, setInsertedCash] = useState<
    PostPurchaseType["inserted_cash"]
  >([]);

  const [noti, contextHolder] = notification.useNotification();

  const showProductDetailModal = (product: FetchProductsType) => {
    setSelectedProduct(product);
    setQuantity(1); // รีเซ็ตจำนวนเป็น 1 ทุกครั้งที่เปิด modal ใหม่
    setIsModalVisible(true);
  };

  // ฟังก์ชันสำหรับการซื้อสินค้า (คุณต้องใส่ logic จริงตรงนี้)
  const handleBuy = async () => {
    if (selectedProduct) {
      try {
        const purchaseData: PostPurchaseType = {
          machine_product_id: selectedProduct.id,
          quantity: quantity,
          inserted_cash: insertedCash,
        };

        const result = await postPurchase(purchaseData);

        if (result.success) {
          noti.success({
            message: "ซื้อสินค้าสำเร็จ",
            description: (
              // ต้องการแสดงว่าถอนเงินเป็นอะไรบ้าง
              <div>
                <p>
                  เงินทอน:{" "}
                  {result.data.change
                    .reduce(
                      (total, item) => total + item.value * item.quantity,
                      0,
                    )
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "THB",
                    })}
                </p>
                <p>จำนวนที่ซื้อ: {result.data.quantity_purchased}</p>
              </div>
            ),
          });
          refetchCashInventory();
          refetchProductList();
          handleClose();

          if (result.data.change.length > 0) {
            setChargeModalData(result.data.change);
            setChargeModalVisible(true);
          }
        }
      } catch (error: any) {
        // ใช้ `any` หรือระบุ type ของ error ที่คาดการณ์ไว้
        // จัดการข้อผิดพลาดที่เกิดจากการเรียก API (เช่น network error, server error)
        console.error("Error during purchase:", error);
        noti.error({
          message: "เกิดข้อผิดพลาด",
          description: error?.response?.data?.message || "ไม่สามารถทำรายการได้",
        });
        handleClose();
      }
    }
  };

  const handleReset = () => {
    setInsertedCash([]);
    setQuantity(1);
    setSelectedProduct(null);
    setIsModalVisible(false);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    handleReset();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const cardsPerSlide = 6;
  const totalProducts = data?.length;

  const chunkProducts = (arr: FetchProductsType[], size: number) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArray.push(arr.slice(i, i + size));
    }
    return chunkedArray;
  };

  const productSlides = chunkProducts(data, cardsPerSlide);

  return (
    <Layout>
      <div className="col-span-3 rounded-lg overflow-hidden shadow-lg mb-6">
        <Carousel className="col-span-3" autoplay>
          {data?.slice(0, 5).map((product) => (
            <div key={`banner-${product.id}`}>
              {" "}
              {/* เพิ่ม key ที่ไม่ซ้ำกัน */}
              <Image
                src={product.image_url}
                alt={product.name}
                width={300}
                height={100}
                className="aspect-video w-full object-cover"
              />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="-products">
        {totalProducts === 0 ? (
          <div className="text-center text-gray-500">
            <Empty description="No products available." />
          </div>
        ) : (
          <h1 className="text-2xl font-bold mb-4">Products</h1>
        )}

        {totalProducts > cardsPerSlide ? ( // แสดง Carousel ก็ต่อเมื่อมี Card เกินจำนวนที่กำหนดต่อสไลด์
          <Carousel dotPosition="bottom" arrows={true}>
            {productSlides.map((slide, index) => (
              <div key={index}>
                <div className="grid grid-cols-3 gap-6">
                  {" "}
                  {/* ใช้ grid ภายในแต่ละสไลด์ */}
                  {slide.map((product: FetchProductsType) => (
                    <Card
                      key={product.id} // ต้องมี key สำหรับ Card แต่ละใบ
                      hoverable
                      className="m-2"
                      style={{
                        filter:
                          product.quantity_in_stock < 1
                            ? "grayscale(100%)"
                            : "none",
                        opacity: product.quantity_in_stock < 1 ? 0.8 : 1,
                        pointerEvents:
                          product.quantity_in_stock < 1 ? "none" : "auto",
                      }}
                      styles={{
                        body: {
                          padding: 16,
                        },
                      }}
                      onClick={() => {
                        if (product.quantity_in_stock > 0) {
                          showProductDetailModal(product);
                        }
                      }}
                      cover={
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={200}
                          height={100}
                          className="aspect-square object-cover"
                        />
                      }
                    >
                      <Meta
                        title={
                          <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                              {product.name}
                            </h2>
                            {product.quantity_in_stock < 1 && (
                              <span className="text-red-500 text-sm ml-2">
                                สินค้าหมด
                              </span>
                            )}
                          </div>
                        }
                        description={
                          <div>
                            <h3 className="font-bold text-xl">
                              {product.current_price.toLocaleString("en-US", {
                                style: "currency",
                                currency: "THB",
                              })}
                            </h3>
                            <p>{product.description}</p>
                          </div>
                        }
                      />
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.map((product) => (
              <Card
                key={product.id}
                hoverable
                className="m-2"
                style={{
                  filter:
                    product.quantity_in_stock < 1 ? "grayscale(100%)" : "none",
                  opacity: product.quantity_in_stock < 1 ? 0.8 : 1,
                  pointerEvents:
                    product.quantity_in_stock < 1 ? "none" : "auto",
                }}
                styles={{
                  body: {
                    padding: 16,
                  },
                }}
                onClick={() => {
                  if (product.quantity_in_stock > 0) {
                    showProductDetailModal(product);
                  }
                }}
                cover={
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={200}
                    height={100}
                    className="aspect-square object-cover"
                  />
                }
              >
                <Meta
                  title={
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">{product.name}</h2>
                      {product.quantity_in_stock < 1 && (
                        <span className="text-red-500 text-sm ml-2">
                          สินค้าหมด
                        </span>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <h3 className="font-bold text-xl">
                        {product.current_price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "THB",
                        })}
                      </h3>
                      <p>{product.description}</p>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && ( // แสดง Modal ก็ต่อเมื่อมี selectedProduct
        <>
          <Modal
            title={selectedProduct.name}
            open={isModalVisible} // ใช้ 'open' แทน 'visible' ที่ถูก Deprecated
            onCancel={handleClose}
            footer={[
              <Button key="back" onClick={handleClose}>
                ยกเลิก
              </Button>,
              <Button
                key="buy"
                type="primary"
                onClick={handleBuy}
                disabled={
                  quantity <= 0 ||
                  insertedCash.length === 0 ||
                  insertedCash.reduce(
                    (total, item) =>
                      total +
                      item.quantity *
                        (masCashData?.find((c) => c.id === item.mas_cash_id)
                          ?.value || 0),
                    0,
                  ) <
                    selectedProduct.current_price * quantity
                }
              >
                ซื้อ ({selectedProduct.current_price * quantity} THB)
              </Button>,
            ]}
          >
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-shrink-0">
                <Image
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  width={150}
                  height={150}
                  className="aspect-square object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <p className="text-lg font-semibold">
                  {selectedProduct.description}
                </p>
                <p className="text-2xl font-bold text-blue-600 my-2">
                  ราคา:{" "}
                  {selectedProduct.current_price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "THB",
                  })}
                </p>
                <p className="text-gray-600">
                  คงเหลือ: {selectedProduct.quantity_in_stock} ชิ้น
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <span className="text-lg font-medium">จำนวน:</span>
              <InputNumber
                min={1}
                max={selectedProduct.quantity_in_stock}
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
                className="w-24"
              />
            </div>
          </Modal>

          <div className="fixed top-4 right-4 bg-blue-100 rounded-lg shadow-lg z-[1001] overflow-auto max-h-[70vh]">
            <div className="flex flex-col items-center justify-between p-1">
              <h2 className="text-lg font-semibold">จ่ายเงิน</h2>

              <p>
                จำนวนเงินที่ใส่:{" "}
                {insertedCash
                  .reduce(
                    (total, item) =>
                      total +
                      item.quantity *
                        (masCashData?.find((c) => c.id === item.mas_cash_id)
                          ?.value || 0),
                    0,
                  )
                  .toLocaleString("en-US", {
                    style: "currency",
                    currency: "THB",
                  })}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-1 p-2">
              {masCashData.map((cash) => (
                <Card key={cash.id} className="text-center">
                  <h3 className="font-bold flex items-center justify-center gap-2">
                    {cash.type === "coin" && (
                      <PiCoinVerticalFill className="text-2xl" />
                    )}
                    {cash.type === "bank_note" && (
                      <HiBanknotes className="text-2xl" />
                    )}
                    {cash.value}

                    <span>บาท</span>
                  </h3>
                  {/* <p> */}
                  {/*   จำนวน:{" "} */}
                  {/*   {insertedCash.find((item) => item.mas_cash_id === cash.id) */}
                  {/*     ?.quantity || 0} */}
                  {/* </p> */}

                  {/* <p> */}
                  {/*   มูลค่า:{" "} */}
                  {/*   {cash.value.toLocaleString("en-US", { */}
                  {/*     style: "currency", */}
                  {/*     currency: "THB", */}
                  {/*   })} */}
                  {/* </p> */}

                  <InputNumber
                    min={0}
                    value={
                      insertedCash.find((item) => item.mas_cash_id === cash.id)
                        ?.quantity || 0
                    }
                    onChange={(value) => {
                      const newQuantity =
                        value === undefined ? 0 : (value as number);

                      setInsertedCash((prev) => {
                        const existingCash = prev.find(
                          (item) => item.mas_cash_id === cash.id,
                        );
                        if (existingCash) {
                          if (newQuantity > 0) {
                            return prev.map((item) =>
                              item.mas_cash_id === cash.id
                                ? { ...item, quantity: newQuantity }
                                : item,
                            );
                          } else {
                            return prev.filter(
                              (item) => item.mas_cash_id !== cash.id,
                            );
                          }
                        } else if (newQuantity > 0) {
                          return [
                            ...prev,
                            { mas_cash_id: cash.id, quantity: newQuantity },
                          ];
                        }
                        return prev;
                      });
                    }}
                    className="w-24 !mt-1"
                  />
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      <Modal
        open={chargeModalVisible}
        title="เงินทอน"
        footer={
          <Button
            type="primary"
            onClick={() => {
              setChargeModalVisible(false);
              handleReset();
            }}
          >
            ปิด
          </Button>
        }
      >
        {chargeModalData.length > 0 && (
          <div>
            {chargeModalData.map((item) => (
              <div
                key={item.mas_cash_id}
                className="flex items-center gap-2 mb-2"
              >
                {masCashData.find((c) => c.id === item.mas_cash_id)?.type ===
                  "coin" && <PiCoinVerticalFill className="text-2xl" />}
                {masCashData.find((c) => c.id === item.mas_cash_id)?.type ===
                  "bank_note" && <HiBanknotes className="text-2xl" />}
                <span>
                  {item.value} บาท x {item.quantity} ={" "}
                  {(item.value * item.quantity).toLocaleString("en-US", {
                    style: "currency",
                    currency: "THB",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>
      {contextHolder}
    </Layout>
  );
}
