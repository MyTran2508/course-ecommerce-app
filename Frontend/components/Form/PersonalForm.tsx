import { formPersonalSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RoleType, User } from "@/types/user.type";
import Image from "next/image";
import {
  useGetAvatarQuery,
  useUploadImageMutation,
  useUpdateUserMutation,
  useUpdateUserAdminMutation,
} from "@/redux/services/userApi";
import showToast from "@/utils/showToast";
import { Role, ToastMessage, ToastStatus } from "@/utils/resources";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import { updateUser } from "@/redux/features/userSlice";

const formSchema = formPersonalSchema;

interface PersonalProps {
  userInfor: Omit<User, "re_password">;
  isAdmin?: boolean;
}

const handleSetDefaultValueFrom = (value: Omit<User, "re_password">) => {
  return {
    username: value.username,
    email: value.email,
    firstName: value.firstName,
    lastName: value.lastName,
    photos: "",
    telephone: value.telephone,
    addressLine: value.addresses[0]?.addressLine,
    role: (value.roles as RoleType[])[0].id,
  };
};

function PersonalForm(props: PersonalProps) {
  const { userInfor, isAdmin } = props;
  const dispatch = useAppDispatch();
  const [allowInput, setAllowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);
  const [defaultValueForm, setDefaultValueFrom] = useState(
    handleSetDefaultValueFrom(userInfor)
  );
  const [file, setFile] = useState<File>();
  const [currentAvatar, setCurrentAvatar] = useState<string>();

  const [updateAvatar] = useUploadImageMutation();
  const [updateInformation] = useUpdateUserMutation();
  const [updateUserAdmin] = useUpdateUserAdminMutation();
  const roles = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.roles
  );
  const { data: avatarData, isSuccess: avatarSuccess } = useGetAvatarQuery(
    userInfor.username
  );

  const handleImageError = (type: boolean) => {
    setImageError(type);
  };

  useEffect(() => {
    if (allowInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [allowInput]);

  useEffect(() => {
    setDefaultValueFrom(handleSetDefaultValueFrom(userInfor));
    handleImageError(false);
    // setCurrentAvatar(avatarData.rawAvatar as string);
    setCurrentAvatar(avatarData);
  }, [userInfor, avatarData]);

  const handleClickEdit = () => {
    setAllowInput(!allowInput);
    form.clearErrors();
  };

  const handleClickCancel = () => {
    setAllowInput(!allowInput);
    form.reset();
    form.clearErrors();
  };

  const handleUpdateUser = async (
    data: Omit<User, "re_password" | "password" | "photos">
  ) => {
    let updateSuccess = true;

    await Promise.all([
      isAdmin
        ? updateUserAdmin(data).unwrap()
        : updateInformation(data).unwrap(),
      file ? updateAvatar({ username: data.username, image: file }) : null,
    ])
      .then(([updateUserResponse, updateAvatarResponse]) => {
        console.log(updateUserResponse);
        console.log(updateAvatarResponse);
      })
      .catch((error) => {
        console.error(error);
        updateSuccess = false;
      });

    if (updateSuccess) {
      setAllowInput(!allowInput);
      showToast(ToastStatus.SUCCESS, ToastMessage.UPDATE_USER_SUCCESS);
    } else {
      showToast(ToastStatus.ERROR, ToastMessage.UPDATE_USER_FAIL);
    }

    if ((roles as RoleType[])[0]?.id === Role.ADMIN) {
      dispatch(updateUser());
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: defaultValueForm,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updateUser: Omit<User, "re_password" | "password" | "photos"> = {
      id: userInfor.id,
      username: userInfor.username,
      email: userInfor.email,
      firstName: values.firstName,
      lastName: values.lastName,
      telephone: values.telephone,
      roles: [
        {
          id: values.role,
          name: values.role,
        },
      ],
      addresses: [
        {
          addressLine: values.addressLine,
          postalCode: null,
          defaultAddress: null,
        },
      ],
    };
    handleUpdateUser(updateUser);
  }
  return (
    <div>
      <Form {...form}>
        <form className="mt-5 mx-2">
          <div className="flex flex-col  sticky top-[120px] ">
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
                    onClick={() => handleClickCancel()}
                  >
                    Hủy
                  </Button>
                </div>
              </Fragment>
            )}

            <hr className="mt-2 border border-b-orange-500" />
          </div>
          <div
            className={`${
              isAdmin ? "custom-scrollbar overflow-y-auto h-[500px]" : ""
            }`}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mb-3 mt-3">
                  <FormLabel className="text-black">User Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default "
                      //   className={`border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default ${
                      //     allowInput ? "border-b-blue-700 " : " "
                      //   }`}
                      disabled={true}
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-3 mt-3">
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default "
                      //   className={`border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default ${
                      //     allowInput ? "border-b-blue-700 " : " "
                      //   }`}
                      disabled={true}
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="mb-3 mt-3">
                  <FormLabel className="text-black">First Name</FormLabel>
                  <FormControl>
                    <Input
                      ref={inputRef}
                      className={`border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default ${
                        allowInput && !isAdmin ? "border-b-blue-700 " : " "
                      }`}
                      disabled={!allowInput || isAdmin}
                      value={field.value}
                      onChange={field.onChange}
                    ></Input>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="mb-3 mt-3">
                  <FormLabel className="text-black">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      className={`border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default ${
                        allowInput && !isAdmin ? "border-b-blue-700 " : " "
                      }`}
                      disabled={!allowInput || isAdmin}
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine"
              render={({ field }) => (
                <FormItem className="mb-3 mt-3">
                  <FormLabel className="text-black">Address Line</FormLabel>
                  <FormControl>
                    <Input
                      className={`border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default ${
                        allowInput && !isAdmin ? "border-b-blue-700 " : " "
                      }`}
                      disabled={!allowInput || isAdmin}
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem className="mb-3 mt-3">
                  <FormLabel className="text-black">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      className={`border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default ${
                        allowInput && !isAdmin ? "border-b-blue-700 " : " "
                      }`}
                      disabled={!allowInput || isAdmin}
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className={`mb-3 mt-3 ${isAdmin ? "" : "hidden"}`}>
                  <FormLabel className="text-black">Role</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={!allowInput}
                    >
                      <SelectTrigger
                        className={`focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default w-[200px] ${
                          allowInput ? "border-blue-700 " : ""
                        }`}
                      >
                        <SelectValue placeholder="Chọn quyền" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={Role.ADMIN}>
                            {Role.ADMIN}
                          </SelectItem>
                          <SelectItem value={Role.MANAGER}>
                            {Role.MANAGER}
                          </SelectItem>
                          <SelectItem value={Role.USER}>{Role.USER}</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <div className="flex-between gap-10">
              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem className="mb-14 mt-3 w-full">
                    <FormLabel className="text-black">Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".jpg,.png"
                        className={`border-x-0 border-t-0 rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default ${
                          allowInput && !isAdmin ? "border-b-blue-700 " : " "
                        }`}
                        disabled={!allowInput || isAdmin}
                        onChange={(e) => {
                          setFile(e.target.files?.[0]);
                        }}
                      ></Input>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <div className="w-full">
                {imageError ? (
                  <Fragment>
                    <Image
                      src={
                        currentAvatar !== "Error"
                          ? `data:image/png;base64,${currentAvatar}`
                          : "/banner.jpg"
                      }
                      width={100}
                      height={100}
                      alt=""
                      className="w-20 h-20 rounded-full"
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <Image
                      src={
                        currentAvatar !== "Error"
                          ? `data:image/png;base64,${currentAvatar}`
                          : "/banner.jpg"
                      }
                      width={100}
                      height={100}
                      alt=""
                      onError={() => handleImageError(true)}
                      className="w-20 h-20 rounded-full"
                    />
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PersonalForm;
