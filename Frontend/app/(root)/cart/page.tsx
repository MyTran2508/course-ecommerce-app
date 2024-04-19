"use client";
import CartItem from "@/components/Card/CartItem";
// import Router from "@/components/router/router";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";
import { Cart } from "@/types/cart.type";
import { Course } from "@/types/course.type";
import { totalPrice } from "@/utils/function";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import Loading from "../user/personal/loading";
import { updatePrice } from "@/redux/features/cartSlice";
import showToast from "@/utils/showToast";
import { ToastMessage, ToastStatus } from "@/utils/resources";

const PageCart = () => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const carts = useAppSelector((state) => state.persistedReducer.cartReducer);
  const [cartList, setCartList] = useState<Cart[]>(carts);
  const { data, isLoading, isSuccess } = useGetAllCourseQuery(null);

  // const updatePrice = () => {
  //   const courses = data?.data as Course[];
  //   const updatedCartList = cartList.map((cart) => {
  //     const matchingCourse = courses.find(
  //       (course) => course._id === cart.courseId
  //     );
  //     if (matchingCourse) {
  //       return {
  //         ...cart,
  //         price: matchingCourse.price,
  //       };
  //     }
  //     return cart;
  //   });
  //   setCartList(updatedCartList as Cart[]);
  // };
  useEffect(() => {
    if (isSuccess) {
      dispatch(updatePrice(data?.data as Course[]));
    }
  }, [data]);
  useEffect(() => {}, [carts]);

  if (isLoading) {
    return <Loading />;
  }
  const renderCartItem = () => {
    return (
      <div className="w-full">
        {carts.map((cartItem, index) => (
          <Fragment key={index}>
            <CartItem cartItem={cartItem} />
            {index !== carts.length - 1 && <hr />}
          </Fragment>
        ))}
      </div>
    );
  };

  const handleChangeRouteCheckout = () => {
    if (totalPrice(carts) !== 0) {
      route.push("/payment/checkout");
    } else {
      showToast(ToastStatus.WARNING, ToastMessage.CHECK_PRICE);
    }
  };

  return (
    // <Router>
    <div className="mx-28 xs:mx-2">
      <div className="flex mt-10 xs:flex-col">
        <div className="w-3/4 xs:w-full">
          <div className="text-2xl font-bold mb-10">Shopping Cart</div>
          <div className="font-bold text-[12px] mb-2">
            {carts.length} Courses in Cart
          </div>
          <hr />
          {renderCartItem()}
        </div>
        <div className="mt-20 ml-8 w-1/4 xs:w-full xs:mx-0">
          <div className="opacity-50">Total:</div>
          <div className="text-2xl font-bold mt-4">
            {totalPrice(carts).toLocaleString()} đ
          </div>
          <Button
            className="w-full rounded-none mt-10"
            onClick={() => handleChangeRouteCheckout()}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
    // </Router>
  );
};

export default PageCart;
