"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { BsPencilSquare } from "react-icons/bs";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineArrowUpTray } from "react-icons/hi2";
import CustomButton from "../CustomButton";
import { useRouter } from "next/navigation";
import { User } from "@/types/user.type";
import {
  useForgotPasswordMutation,
  useRegisterUserMutation,
  useVerifyForgotPasswordOTPMutation,
} from "@/redux/services/authApi";
import { useAppDispatch } from "@/redux/hooks/reduxHooks";
import { DataResponse } from "@/types/response.type";
import { Action, StatusCode, ToastStatus } from "@/utils/resources";
import showToast from "@/utils/showToast";
import {
  formForgotPasswordSchema,
  formValidateEmailSchema,
} from "@/utils/formSchema";
import { ForgotPasswordRequest } from "@/types/request.type";

const formSchema = formForgotPasswordSchema;
const validationSchema = formValidateEmailSchema;

function ForgetPasswordForm() {
  const route = useRouter();
  const [openEye, setOpenEye] = useState(false);
  const [email, setEmail] = useState("");
  const [isSendOTP, setSendOTP] = useState(false);
  const [otp, setOTP] = useState<string[]>(Array(length).fill(""));
  const inputsOTP = useRef<HTMLInputElement[]>(Array(length).fill(null));
  const [forgotPassword] = useForgotPasswordMutation();
  const [verifyForgotPasswordOTP] = useVerifyForgotPasswordOTPMutation();

  const handleForgotPassword = async (email: string) => {
    await forgotPassword(email)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
        handleToast(fulfilled, Action.SENT_OTP, email);
      });
  };

  const handleValidateEmail = (values: z.infer<typeof formSchema>) => {
    const { email } = values;

    const validationResult = validationSchema.safeParse({
      email,
    });

    if (validationResult.success) {
      handleForgotPassword(email);
    }
  };

  const handleValidateOTP = async (data: ForgotPasswordRequest) => {
    await verifyForgotPasswordOTP(data)
      .unwrap()
      .then((fulfilled) => {
        handleToast(fulfilled, Action.FORGOT_PASSWORD);
      });

    setOTP(Array(6).fill(""));
  };

  const handleChangeInputOTP = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (value && index < inputsOTP.current.length - 1) {
      inputsOTP.current[index + 1].focus();
    }
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
  };

  const handleToast = (
    dataResult: DataResponse,
    action: string,
    email: string = ""
  ) => {
    if (dataResult?.statusCode === StatusCode.REQUEST_SUCCESS) {
      showToast(ToastStatus.SUCCESS, dataResult?.data as string);

      if (action === Action.SENT_OTP) {
        setSendOTP(true);
        setEmail(email);
      } else if (action === Action.FORGOT_PASSWORD) {
        route.push("/login");
      }
    } else {
      showToast(ToastStatus.ERROR, dataResult?.data as string);
    }
  };

  const toggle = () => {
    setOpenEye(!openEye);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(isSendOTP === false ? validationSchema : formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const OTP: string = otp.join("");

    const forgotPasswordRequest: ForgotPasswordRequest = {
      otp: OTP,
      email: values.email,
      newPassword: values.new_password,
    };

    handleValidateOTP(forgotPasswordRequest);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-1/2 h-4/5 xs:h-4/6 xs:w-4/5 min-h-[470px] bg-gray-100 rounded-3xl xl:flex"
      >
        <div className="h-1/2 p-5 my-1 w-full lg:w-1/2 2xs:text-[10px] xl:text-xs flex justify-center  flex-col">
          {isSendOTP === false ? (
            <Fragment>
              <div className="font-mono mb-2 flex items-center flex-col">
                <div className="text-xl mb-2 "> Forget Password</div>
                <p>Please provide your email address</p>
              </div>
              <div className="mb-2">
                <FormField
                  key={"email"}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-1 ">
                      <FormLabel className="text-black xl:text-xs ">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-black xl:text-xs h-7"
                          placeholder="email"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  className="hover:scale-110 transition duration-700 gap-2 w-full h-7 mt-8"
                  onClick={form.handleSubmit(handleValidateEmail)}
                >
                  <HiOutlineArrowUpTray />
                  Sent OTP
                </Button>
              </div>
            </Fragment>
          ) : (
            <div className="flex justify-center  flex-col mt-32">
              <div className="flex-center text-md mb-6">
                Please enter the OTP & new Password
              </div>
              <div>
                <FormField
                  key={"new_password"}
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem className="mb-1 ">
                      <FormLabel className="text-black xl:text-xs">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute text-xl right-1 cursor-pointer mt-1">
                            {openEye === false ? (
                              <AiOutlineEyeInvisible onClick={toggle} />
                            ) : (
                              <AiOutlineEye onClick={toggle} />
                            )}
                          </div>
                          <Input
                            className="text-black xl:text-xs h-7"
                            type={openEye === false ? "password" : "text"}
                            placeholder="new password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  key={"re_password"}
                  control={form.control}
                  name="re_password"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel className="text-black xl:text-xs h-7">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-black xl:text-xs h-7"
                          type={openEye === false ? "password" : "text"}
                          placeholder="confirm password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
              <FormLabel className="text-black xl:text-xs h-7">OTP</FormLabel>
              <div className="flex flex-center gap-2">
                {[...Array(6)].fill(null).map((_, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputsOTP.current[index] = el!)}
                    maxLength={1}
                    inputMode="numeric"
                    className="border-none border-b-2 w-[40px] text-center"
                    value={otp[index]}
                    onChange={(e) => handleChangeInputOTP(index, e)}
                  />
                ))}
              </div>
              <div className="flex justify-end">
                <div
                  className="bg-gray-100 w-[100px] mt-2 text-[10px] text-black hover:text-orange-600 underline hover:cursor-pointer"
                  onClick={() => handleForgotPassword(email)}
                >
                  Re-sent OTP
                </div>
              </div>
              <Button
                type="submit"
                className="hover:scale-110 transition duration-700 gap-2 w-full h-7 mt-8"
              >
                <HiOutlineArrowUpTray />
                Verify
              </Button>
            </div>
          )}
        </div>
        <div className="w-1/2 lg:block hidden">
          <div className="bg-signup bg-center bg-cover h-full rounded-r-3xl w-full"></div>
        </div>
      </form>
    </Form>
  );
}

export default ForgetPasswordForm;
