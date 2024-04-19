import { formResetPasswordSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User } from "@/types/user.type";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import { ChangePasswordRequest } from "@/types/request.type";
import { useChangePasswordMutation } from "@/redux/services/userApi";
import { DataResponse } from "@/types/response.type";
import showToast from "@/utils/showToast";
import { ToastMessage, ToastStatus } from "@/utils/resources";

const formSchema = formResetPasswordSchema;

function PasswordForm() {
  const [allowInput, setAllowInput] = useState(false);
  const [openEye, setOpenEye] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const userId = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.id
  );

  const [changePassword] = useChangePasswordMutation();

  const toggle = () => {
    setOpenEye(!openEye);
  };

  useEffect(() => {
    if (allowInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [allowInput]);

  const handleClickEdit = () => {
    setAllowInput(!allowInput);
    form.reset();
    form.clearErrors();
  };

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    await changePassword(data)
      .unwrap()
      .then((fulfilled) => {
        handleToast(fulfilled);
      });
  };

  const handleToast = (dataResult: DataResponse) => {
    if (dataResult?.statusCode === 200) {
      handleClickEdit();
      showToast(ToastStatus.SUCCESS, ToastMessage.CHANGE_PASSWORD_SUCCESS);
    } else {
      showToast(ToastStatus.ERROR, ToastMessage.CHANGE_PASSWORD_FAIL);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const changePasswordRequest: ChangePasswordRequest = {
      userId: userId,
      newPassword: values.new_password,
      oldPassword: values.old_password,
    };

    handleChangePassword(changePasswordRequest);
  }

  return (
    <div>
      <Form {...form}>
        <form className="mt-5 mx-4">
          <div className="flex justify-between sticky top-[120px] bg-white">
            <div className="w-full "> Đổi Mật Khẩu</div>
            {!allowInput ? (
              <Fragment>
                <div className="flex justify-end">
                  <Button
                    className="rounded-3xl w-max"
                    type="button"
                    onClick={() => handleClickEdit()}
                  >
                    Chỉnh Sửa
                  </Button>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className="flex gap-2 justify-end">
                  <Button
                    className="text-orange-400 border border-orange-400  bg-white rounded-3xl hover:bg-white w-max"
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    Lưu
                  </Button>
                  <Button
                    className=" bg-none rounded-3xl w-max"
                    type="button"
                    onClick={() => handleClickEdit()}
                  >
                    Hủy
                  </Button>
                </div>
              </Fragment>
            )}

            <hr className="mt-2 border border-b-orange-500" />
          </div>
          {allowInput ? (
            <Fragment>
              <div className="flex flex-col items-center w-full">
                <FormField
                  control={form.control}
                  name="old_password"
                  render={({ field }) => (
                    <FormItem className="mb-14 mt-3">
                      <FormLabel className="text-black">Old Password</FormLabel>
                      <FormControl>
                        <Input
                          ref={inputRef}
                          type="password"
                          className={`w-[400px] border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default ${
                            allowInput ? "border-b-blue-700 " : " "
                          }`}
                          disabled={!allowInput}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem className="mb-14 mt-3">
                      <FormLabel className="text-black">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute text-2xl right-1 cursor-pointer mt-2">
                            {openEye === false ? (
                              <AiOutlineEyeInvisible onClick={toggle} />
                            ) : (
                              <AiOutlineEye onClick={toggle} />
                            )}
                          </div>
                          <Input
                            className={`w-[400px] border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default ${
                              allowInput ? "border-b-blue-700 " : " "
                            }`}
                            type={openEye === false ? "password" : "text"}
                            disabled={!allowInput}
                            {...field}
                          ></Input>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="re_password"
                  render={({ field }) => (
                    <FormItem className="mb-14 mt-3">
                      <FormLabel className="text-black">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={`w-[400px] border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default ${
                            allowInput ? "border-b-blue-700 " : " "
                          }`}
                          type={openEye === false ? "password" : "text"}
                          disabled={!allowInput}
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </Fragment>
          ) : (
            ""
          )}
        </form>
      </Form>
    </div>
  );
}

export default PasswordForm;
