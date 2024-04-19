"use client";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";
import { GrStatusWarning } from "react-icons/gr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import showToast from "@/utils/showToast";
import { ToastMessage, ToastStatus } from "@/utils/resources";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import { convertVNDtoUSD, totalPrice } from "@/utils/function";
import { Button } from "@/components/ui/button";
import Checkout from "@/components/Checkout/PayPal";
import { updatePrice } from "@/redux/features/cartSlice";
import { Course } from "@/types/course.type";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";

function PageCheckout() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const carts = useAppSelector((state) => state.persistedReducer.cartReducer);
  const totalPriceVND = totalPrice(carts);
  const totalPriceUSD = convertVNDtoUSD(totalPriceVND);
  const { data, isLoading, isSuccess } = useGetAllCourseQuery(null);
  useEffect(() => {
    if (isSuccess) {
      dispatch(updatePrice(data?.data as Course[]));
    }
  }, [data]);
  const handleToggle = () => {
    setOpen(!open);
  };

  const handleCheckout = () => {
    if (open) {
    } else {
      showToast(ToastStatus.ERROR, ToastMessage.NOT_SELECT_PAYMENT);
    }
  };

  return (
    <div>
      <div className="border-b bg-white w-full h-20 border-b-1 border-gray-200 text-black sticky top-0 z-10 shadow-md">
        <div className="max-w-screen-2xl h-full mx-auto flex items-center justify-between px-4">
          <Link href={"/"} className="text-2xl uppercase">
            E-LEANING
          </Link>
          <div>
            <Link href={"/cart"} className="hover:text-orange-400 font-bold">
              Cancel
            </Link>
          </div>
        </div>
      </div>
      <div className="flex xs:flex-col">
        <div className="w-2/4 ml-40 p-10 xs:w-full xs:px-2 xs:ml-0">
          <div className="text-2xl font-bold">Thanh Toán</div>
          <div className="text-md font-bold mt-12 mb-4">
            Phương Thức Thanh Toán
          </div>
          <div>
            <Disclosure>
              {() => (
                <>
                  <Disclosure.Button
                    onClick={() => handleToggle()}
                    className="flex w-full justify-between border-b-2 bg-gray-100 px-2 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 items-center sticky top-0"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl">
                        {open ? <BiRadioCircleMarked /> : <BiRadioCircle />}
                      </div>
                      <Image
                        src={
                          "https://www.udemy.com/staticx/udemy/images/v9/hpp-paypal.svg"
                        }
                        alt="paypal-image"
                        width={40}
                        height={40}
                      />
                      <div> Pay Pal</div>
                    </div>
                  </Disclosure.Button>
                  <div className="text-sm text-gray-500 bg-gray-50">
                    {open ? (
                      <>
                        <div className="p-10 ">
                          <div>
                            Để hoàn tất giao dịch của bạn, chúng tôi sẽ chuyển
                            bạn đến máy chủ bảo mật của PayPal.
                          </div>
                          <div className="flex gap-1 my-5">
                            <GrStatusWarning className="text-3xl mt-2 mx-2" />
                            Rất tiếc, PayPal không hỗ trợ thanh toán bằng VNĐ
                            nên khoản thanh toán của bạn sẽ bằng USD.
                          </div>
                          <div className="font-bold">
                            Số tiền bạn sẽ phải trả bằng Paypal là ${" "}
                            {totalPriceUSD}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              )}
            </Disclosure>
          </div>
        </div>
        <div className="w-2/4 bg-orange-100 h-screen p-10 pr-40 xs:w-full xs:px-2">
          <div className="font-bold text-2xl">Tóm Tắt</div>
          <div className="flex-between mt-10 opacity-75 text-[12px] mb-10">
            <div> Giá: </div>
            <div>₫{totalPriceVND.toLocaleString()}</div>
          </div>
          <hr className="border-black" />
          <div className="flex-between mt-5 opacity-75 text-[12px] mb-5 font-bold">
            <div> Tổng cộng: </div>
            <div>₫{totalPriceVND.toLocaleString()}</div>
          </div>
          <div className="opacity-60 text-[12px]">
            Bằng việc hoàn tất giao dịch mua, bạn đồng ý với các Điều khoản dịch
            vụ này.
          </div>
          {open ? (
            <Checkout price={totalPriceUSD} />
          ) : (
            <Button
              className="w-full h-14 flex items-center justify-center mt-4 rounded-sm"
              onClick={() => handleCheckout()}
            >
              Hoàn Thành Thanh Toán
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageCheckout;
