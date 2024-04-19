import React, { useState, useEffect } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import showToast from "@/utils/showToast";
import { ToastMessage, ToastStatus } from "@/utils/resources";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import { useRouter } from "next/navigation";
import { setCart, updatePrice } from "@/redux/features/cartSlice";
import { useAddOrderMutation } from "@/redux/services/orderApi";
import { Order, OrderStatus, ShippingMethod } from "@/types/order.type";
import { isFulfilled } from "@reduxjs/toolkit";
import { convertVNDtoUSD, totalPrice } from "@/utils/function";
import { useLazyGetAllCourseQuery } from "@/redux/services/courseApi";
import { Course } from "@/types/course.type";

interface CheckoutProps {
  price: number;
}

const Checkout = (props: CheckoutProps) => {
  const { price } = props;
  const router = useRouter();
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [orderID, setOrderID] = useState<string | false>(false);
  const CLIENT_ID: string = process.env.NEXT_PUBLIC_CLIENT_ID || "";
  const carts = useAppSelector((state) => state.persistedReducer.cartReducer);
  const user = useAppSelector(
    (state) => state.persistedReducer.userReducer.user
  );
  const [addOrder] = useAddOrderMutation();
  const dispatch = useAppDispatch();
  const totalPriceVND = totalPrice(carts);
  const totalPriceUSD = convertVNDtoUSD(totalPriceVND);
  const [cartList, setCardList] = useState(carts);

  const [getCourse, { data, isLoading, isSuccess }] =
    useLazyGetAllCourseQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(updatePrice(data?.data as Course[]));
    }
  }, [data]);
  useEffect(() => {
    console.log(carts);
  }, [carts]);
  useEffect(() => {
    getCourse(null);
  }, []);

  // creates a paypal order
  const createOrder = (data: any, actions: any) => {
    getCourse(null);
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Thanh Toán Khóa Học",
            amount: {
              currency_code: "USD",
              value: totalPriceUSD,
            },
          },
        ],
      })
      .then((orderID: string) => {
        setOrderID(orderID);
        return orderID;
      });
  };

  // check Approval
  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(function (details: any) {
      const { payer } = details;
      setSuccess(true);
    });
  };

  // capture likely error
  const onError = (data: any, actions: any) => {
    showToast(ToastStatus.ERROR, ToastMessage.PAYMENT_FAIL);
    setErrorMessage("An Error occurred with your payment");
  };

  const handleAddOrder = async (newOrder: Order) => {
    await addOrder(newOrder)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
        showToast(ToastStatus.SUCCESS, ToastMessage.PAYMENT_SUCCESS);
        router.push("/");
      });
  };

  useEffect(() => {
    if (success) {
      handleSaveOrder();
      handleRemoveFormCart();
    }
  }, [success]);

  const handleRemoveFormCart = () => {
    const newCarts = carts.filter((cart) => cart.checked !== true);
    dispatch(setCart(newCarts));
  };

  const handleSaveOrder = () => {
    const orderItems = carts
      .filter((cart) => cart.checked === true)
      .map((cart) => {
        return {
          price: cart.price,
          courseId: cart.courseId as string,
        };
      });
    const newOrder: Order = {
      totalPrice: totalPriceVND,
      orderStatus: OrderStatus.PAID,
      shippingMethod: ShippingMethod.PAYPAL,
      orderItems: orderItems,
      user: {
        id: user.id,
      },
    };
    handleAddOrder(newOrder);
  };

  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: CLIENT_ID,
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrder}
          onApprove={onApprove}
          className="w-full h-10 mt-4 "
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default Checkout;
