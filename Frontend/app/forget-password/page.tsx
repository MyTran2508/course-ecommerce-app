"use client";
import ForgetPasswordFrom from "@/components/Form/ForgetPasswordForm";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import { useRouter } from "next/navigation";
import React from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";

function PageForgetPassword() {
  const route = useRouter();

  return (
    <div className=" bg-blue-100 border-6 p-2">
      <div className="flex justify-start items-center gap-2 font-normal">
        <IoChevronBackCircleSharp
          className="text-3xl ml-2 cursor-pointer"
          onClick={() => {
            route.back();
          }}
        />
        <p className="">Back</p>
      </div>
      <div className="flex justify-center mt-10 h-screen">
        <ForgetPasswordFrom />
      </div>
    </div>
  );
}

export default PageForgetPassword;
