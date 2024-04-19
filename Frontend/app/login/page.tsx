"use client";
import LoginForm from "@/components/Form/LoginForm";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import { useLoginUserMutation } from "@/redux/services/authApi";
import { useRouter } from "next/navigation";
import React from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";

function PageLogin() {
  const route = useRouter();
  const token = useAppSelector(
    (state) => state.persistedReducer.authReducer.token
  );

  return (
    <div className=" bg-blue-100 border-6 p-2">
      <div className="flex justify-start items-center gap-2 font-normal">
        <IoChevronBackCircleSharp
          className="text-3xl ml-2 cursor-pointer"
          onClick={() => {
            route.push("/");
          }}
        />
        <p className="">Back to Home</p>
      </div>
      <div className="flex justify-center mt-10 h-screen">
        <LoginForm />
      </div>
    </div>
  );
}

export default PageLogin;
