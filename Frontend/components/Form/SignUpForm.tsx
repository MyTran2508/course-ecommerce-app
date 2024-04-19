"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
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
  useRegisterUserMutation,
  useVerifyRegisterOTPMutation,
} from "@/redux/services/authApi";
import { DataResponse } from "@/types/response.type";
import { Action, StatusCode, ToastStatus } from "@/utils/resources";
import showToast from "@/utils/showToast";
import { formSignUpSchema, validationSignUpSchema } from "@/utils/formSchema";

const formSchema = formSignUpSchema;
const validationSchema = validationSignUpSchema;
const initialUser: Omit<User, "id"> = {
  username: "",
  password: "",
  addresses: [
    {
      addressLine: "",
      postalCode: null,
      defaultAddress: true,
    },
  ],
  roles: null,
  photos: "",
  telephone: "",
  firstName: "",
  lastName: "",
  email: "",
};

function SignUpForm() {
  const route = useRouter();
  const [openEye, setOpenEye] = useState(false);
  const [changPage, setChangePage] = useState(false);
  const [changeSchema, setChangeSchema] = useState(false);
  const [newUser, setNewUser] =
    useState<Omit<User, "id" | "photos" | "roles">>(initialUser);
  const [isUserExisted, setUserExisted] = useState(false);
  const [isSendOTP, setSendOTP] = useState(false);
  const [otp, setOTP] = useState<string[]>(Array(length).fill(""));
  const inputsOTP = useRef<HTMLInputElement[]>(Array(length).fill(null));
  const [registerUser, registerUserResult] = useRegisterUserMutation();
  const [validationOTP, validationOTPResult] = useVerifyRegisterOTPMutation();

  const handleRegister = async (
    newUser: Omit<User, "id" | "photos" | "roles">
  ) => {
    await registerUser(newUser)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
        handleToast(fulfilled, Action.SENT_OTP);
      });
  };

  const handleValidateOTP = async () => {
    const OTP: string = otp.join("");
    await validationOTP({ data: newUser, otp: OTP })
      .unwrap()
      .then((fulfilled) => {
        handleToast(fulfilled, Action.REGISTER);
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
  // useEffect(() => {}, [newUser]);

  const handleToast = (dataResult: DataResponse, action: string) => {
    if (dataResult?.statusCode === StatusCode.REQUEST_SUCCESS) {
      showToast(ToastStatus.SUCCESS, dataResult?.data as string);

      if (action === Action.SENT_OTP) {
        setSendOTP(true);
      } else if (action === Action.REGISTER) {
        showToast(ToastStatus.SUCCESS, "Đăng Ký Thành Công");
        route.push("/login");
      }
    } else {
      if (action === Action.SENT_OTP) {
        setUserExisted(true);
        handleChangeForm();
      }

      showToast(ToastStatus.ERROR, dataResult?.data as string);
    }
  };

  const toggle = () => {
    setOpenEye(!openEye);
  };

  const handleChangeForm = () => {
    setChangePage(!changPage);
    setChangeSchema(!changeSchema);
  };

  const handleNext = (values: z.infer<typeof formSchema>) => {
    const { username, email, password, re_password } = values;

    const validationResult = validationSchema.safeParse({
      username,
      email,
      password,
      re_password,
    });

    if (validationResult.success) {
      handleChangeForm();
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(
      changeSchema === false ? validationSchema : formSchema
    ),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      telephone,
      addressLine,
    } = values;

    const newUser: Omit<User, "id" | "photos" | "roles"> = {
      username,
      password,
      email,
      firstName,
      lastName,
      telephone,
      addresses: [
        {
          addressLine: addressLine,
          postalCode: null,
          defaultAddress: true,
        },
      ],
    };

    setNewUser(newUser);
    handleRegister(newUser);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-1/2 h-4/5 xs:h-4/6 xs:w-4/5 min-h-[470px] bg-gray-100 rounded-3xl xl:flex"
      >
        <div className="h-1/2 p-5 my-1 w-full lg:w-1/2 2xs:text-[10px] xl:text-xs ">
          <div className="font-mono mb-2 flex-center flex-col ">
            <div className="text-xl mb-2 "> Đăng Ký</div>
            <p>Tạo Tài Khoản Một Cách Dễ Dàng!!</p>
          </div>
          {isSendOTP === false ? (
            <>
              {changPage === false ? (
                <div className="mb-2">
                  <FormField
                    key={"username"}
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="mb-1 ">
                        <FormLabel className="text-black xl:text-xs ">
                          Tên Tài Khoản
                        </FormLabel>
                        <FormControl>
                          <Input
                            className={
                              isUserExisted
                                ? "text-red xl:text-xs h-7 border-red-600 border-spacing-10"
                                : "text-black xl:text-xs h-7"
                            }
                            placeholder="username"
                            {...field}
                          ></Input>
                        </FormControl>
                        <FormMessage className="text-[10px]"></FormMessage>
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    key={"password"}
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="mb-1 ">
                        <FormLabel className="text-black xl:text-xs">
                          Mật Khẩu
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
                              placeholder="password"
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
                          Nhập Lại Mật Khẩu
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-black xl:text-xs h-7"
                            type={openEye === false ? "password" : "text"}
                            placeholder="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <div className="text-[12px] mt-2 flex justify-end xs:text-[10px]">
                    <CustomButton
                      title="Next"
                      type="summit"
                      containerStyles="xs:text-[10px] py-1 px-4 bg-white border rounded-xl hover:scale-110 duration-300"
                      handleClick={() => handleNext(form.getValues())}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex-between gap-2">
                    <FormField
                      key={"firstName"}
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="mb-1 ">
                          <FormLabel className="text-black xl:text-xs h-7">
                            Tên
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="text-black xl:text-xs h-7"
                              placeholder="First Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      key={"lastName"}
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="mb-1 ">
                          <FormLabel className="text-black xl:text-xs h-7">
                            Họ
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="text-black xl:text-xs h-7"
                              placeholder="Last Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    key={"phone"}
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem className="mb-1 ">
                        <FormLabel className="text-black xl:text-xs h-7">
                          SĐT
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-black xl:text-xs h-7"
                            placeholder="phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    key={"addressLine"}
                    control={form.control}
                    name="addressLine"
                    render={({ field }) => (
                      <FormItem className="mb-1 ">
                        <FormLabel className="text-black xl:text-xs h-7">
                          Địa Chỉ
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-black xl:text-xs h-7"
                            placeholder="address line"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="hover:scale-110 transition duration-700 gap-2 mt-1 w-full h-7"
                  >
                    <BsPencilSquare />
                    Đăng Ký
                  </Button>
                  <div className="text-[12px] mt-2 flex-end xs:text-[10px]">
                    <CustomButton
                      title="Back"
                      containerStyles="xs:text-[10px] py-1 px-4 bg-white border rounded-xl hover:scale-110 duration-300"
                      handleClick={() => {
                        handleChangeForm();
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center h-full flex-col">
              <div className="flex-center text-md mb-6">Vui Lòng Nhập OTP</div>
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
                  onClick={() => handleRegister(newUser)}
                >
                  Gửi lại OTP
                </div>
              </div>
              <Button
                type="button"
                className="hover:scale-110 transition duration-700 gap-2 w-full h-7 mt-8"
                onClick={() => handleValidateOTP()}
              >
                <HiOutlineArrowUpTray />
                Gửi
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

export default SignUpForm;
