"use client";
import PersonalForm from "@/components/Form/PersonalForm";
import { AuthState } from "@/redux/features/authSlice";
// import { useGetByUserNameQuery } from "@/redux/services/authApi";
import { User } from "@/types/user.type";
import React, { Suspense, useEffect } from "react";
import Loading from "./loading";
import { useGetByUserNameQuery } from "@/redux/services/userApi";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import { AiOutlineMenu } from "react-icons/ai";

function PagePersonal() {
  const user = useAppSelector((state) => state.persistedReducer.authReducer);
  // let user = JSON.parse(localStorage.getItem("user") || "{}");
  const { data, error, isLoading, isSuccess } = useGetByUserNameQuery(
    user.username as string
  );

  if (isLoading) return <Loading />;

  return (
    <div className="mt-10 mr-28 w-full">
      <div className="sticky top-[80px] bg-white h-10">
        <div className="font-bold">
          <div className="flex-center">Thông Tin Cá Nhân </div>
        </div>
        <hr />
      </div>
      <PersonalForm userInfor={data?.data as User} />
    </div>
  );
}

export default PagePersonal;
