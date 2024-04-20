"use client";
import Link from "next/link";
import React, { Fragment, use, useEffect, useState } from "react";
import CustomButton from "../CustomButton";
import SearchBar from "../SearchBar/SearchBar";
import { AiOutlineMenu } from "react-icons/ai";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { iconMap } from "@/utils/map";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import { setCredential, logout } from "@/redux/features/authSlice";
import Image from "next/image";
import { Role, ToastMessage, ToastStatus } from "@/utils/resources";
import showToast from "@/utils/showToast";
import { FiShoppingCart } from "react-icons/fi";
import {
  useGetAvatarQuery,
  useGetByUserNameQuery,
  useLazyGetAvatarQuery,
  useLazyGetByUserNameQuery,
} from "@/redux/services/userApi";
import { RoleType, User } from "@/types/user.type";
import { loadUser, removeUser, setUser } from "@/redux/features/userSlice";
import { AiOutlineRight } from "react-icons/ai";
import "../style/category.scss";
import Loading from "@/app/(root)/user/personal/loading";
import { BiSearchAlt } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

const links = [
  { href: "/login", label: "Login", icon: "BiLogIn" },
  { href: "/signup", label: "Sign Up", icon: "BsFillPenFill" },
];

function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.persistedReducer.cartReducer);
  const [userData, setUserData] = useState<User>();
  const [isLogout, setLogout] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<string>();
  const user = useAppSelector((state) => state.persistedReducer.authReducer);
  const email = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.email
  );
  const roles = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.roles
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [getByUserName, { data: userNameData, isSuccess: userNameSuccess }] =
    useLazyGetByUserNameQuery();

  const [getAvatar, { data: avatarData, isSuccess: avatarSuccess }] =
    useLazyGetAvatarQuery();

  useEffect(() => {
    if (user.isActive) {
      getAvatar(user.username as string);
      getByUserName(user.username as string);
    }
  }, [user.isActive]);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  useEffect(() => {
    if (userNameSuccess) {
      const userState: Pick<
        User,
        "username" | "photos" | "email" | "id" | "roles"
      > = {
        id: (userNameData?.data as User).id,
        username: (userNameData?.data as User).username,
        // photos: avatarData?.rawAvatar as string,
        photos: avatarData as string,
        email: (userNameData?.data as User).email,
        roles: (userNameData?.data as User).roles,
      };
      dispatch(setUser(userState));
      dispatch(loadUser());
      setUserData(userNameData?.data as User);
    }
    if (avatarSuccess) {
      // setCurrentAvatar(avatarData.rawAvatar as string);
      setCurrentAvatar(avatarData);
    }
  }, [userNameData, avatarData]);

  const handleLogout = () => {
    dispatch(removeUser());
    dispatch(logout());
    dispatch(loadUser());
    setLogout(true);
    router.push("/");
    showToast(ToastStatus.SUCCESS, ToastMessage.LOGOUT_SUCCESS);
  };

  const handleChangeRouteCart = () => {
    router.push("/cart");
  };
  const handleSearch = () => {
    router.push(`/course/search?q=${searchQuery}`);
    handleOpenSearchDialog();
  };
  const handleOpenSearchDialog = () => {
    setOpenDialog(!isOpenDialog);
  };

  const MAX_TITLE_LENGTH = 25;
  const truncatedEmail =
    email.length > MAX_TITLE_LENGTH
      ? email.substring(0, MAX_TITLE_LENGTH) + "..."
      : email;
  return (
    <div className="border-b bg-header w-full h-20 border-b-1 border-gray-200 text-black sticky top-0 z-30 shadow-md">
      <div className="max-w-screen-2xl h-full mx-auto flex items-center justify-between px-16 xs:px-5">
        <Link href={"/"} className="text-2xl flex items-center">
          <h1 className="text-2xl uppercase font-semibold tracking-wide text-gray-700">
            E-LEANING
          </h1>
          {/* <Category /> */}
        </Link>

        <div className="hidden lg:inline-flex">
          <SearchBar />
        </div>

        <div className="flex-center gap-3">
          <div
            className="lg:hidden xs:text-xl"
            onClick={handleOpenSearchDialog}
          >
            <BiSearchAlt />
          </div>
          <div>
            <Menu>
              <Menu.Button
                className=" animate-background-shine bg-[linear-gradient(110deg,#FF8C00,45%,#ffff99,55%,#FF8C00)] bg-[length:250%_100%] bg-clip-text text-transparent rounded-xl border py-1 px-2"
                data-aos="fade-up"
              >
                Account Test
              </Menu.Button>
              <Menu.Items className="absolute right-40 mt-2  origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
                <div className="px-1 py-1">
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div className="flex flex-col space-y-2">
                      <h2 className="font-bold italic"> User Account</h2>
                      <div className="flex gap-2">
                        <strong> Username: </strong>
                        userDemo
                      </div>
                      <div className="flex gap-2">
                        <strong> Password: </strong>
                        userDemo
                      </div>
                      <hr></hr>
                      <h2 className="font-bold italic"> Paypal Sandbox</h2>
                      <div>
                        <div className="flex gap-2">
                          <strong> Username: </strong>
                          sb-xgzqg28259118@personal.example.com
                        </div>
                        <div className="flex gap-2">
                          <strong> Password: </strong>
                          u.=5Om_p
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </Menu.Items>
            </Menu>
          </div>
          {user?.username !== "" ? (
            <div className="flex-center gap-10">
              {roles && (roles as RoleType[])[0]?.id !== Role.USER ? (
                <Fragment>
                  {(roles as RoleType[])[0]?.id === Role.ADMIN ? (
                    <div className="xs:hidden">
                      <Link href={"/admin/overview"}>Trang Admin</Link>
                    </div>
                  ) : (
                    <div className="xs:hidden">
                      <Link href={"/instructor/courses"}>Quản lý khóa học</Link>
                    </div>
                  )}
                </Fragment>
              ) : (
                <div className="xs:hidden flex gap-2">
                  <Link href={"/my-courses"}>Khóa Học Của Tôi</Link>
                </div>
              )}

              <div
                className="flex relative hover:cursor-pointer"
                onClick={() => handleChangeRouteCart()}
              >
                <span className="absolute bg-orange-400 rounded-full text-xs text-white ml-4 px-1">
                  {cart.length}
                </span>
                <FiShoppingCart className="text-2xl" />
              </div>

              <div>
                <Menu>
                  <Menu.Button>
                    <Image
                      src={
                        currentAvatar !== "Error"
                          ? `data:image/png;base64,${currentAvatar}`
                          : "/banner.jpg"
                      }
                      width={400}
                      height={400}
                      className="w-12 h-12 rounded-full ml-2"
                      alt="avatar"
                    />
                  </Menu.Button>
                  <Menu.Items className="absolute right-2 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
                    <div className="px-1 py-1">
                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <div className="flex gap-3 items-center">
                          <Image
                            src={
                              currentAvatar !== "Error"
                                ? `data:image/jpeg;base64,${currentAvatar}`
                                : "/banner.jpg"
                            }
                            width={400}
                            height={400}
                            alt="avt"
                            className="w-16 h-16 rounded-full"
                          />
                          <div>
                            <h4 className="font-bold text-orange-400">
                              {" "}
                              {userData ? userData.firstName : ""}
                            </h4>
                            <h4> {truncatedEmail}</h4>
                          </div>
                        </div>
                        <hr className="my-4" />

                        <div className="flex-col ">
                          {roles &&
                          (roles as RoleType[])[0]?.id !== Role.USER ? (
                            <Fragment>
                              {(roles as RoleType[])[0]?.id === Role.ADMIN ? (
                                <div className="lg:hidden">
                                  <Link href={"/admin/overview"}>
                                    Trang Admin
                                  </Link>
                                  <hr className="my-4" />
                                </div>
                              ) : (
                                <div className="lg:hidden">
                                  <Link href={"/instructor/courses"}>
                                    Quản lý khóa học
                                  </Link>
                                  <hr className="my-4" />
                                  <Link href={"/instructor/courses/create"}>
                                    Tạo khóa học
                                  </Link>
                                  <hr className="my-4" />
                                </div>
                              )}
                            </Fragment>
                          ) : (
                            <Fragment>
                              <div className="lg:hidden flex">
                                <Link href={"/my-courses"}>
                                  Khóa Học Của Tôi
                                </Link>
                                <hr className="my-4" />
                              </div>
                            </Fragment>
                          )}
                          <div>
                            <Link href={"/user/personal"}>Trang Cá Nhân </Link>
                            <hr className="my-4" />
                          </div>
                          <div
                            className="hover:cursor-pointer"
                            onClick={() => {
                              handleLogout();
                            }}
                          >
                            Đăng Xuất
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          ) : (
            <div className="lg:inline-flex gap-3 flex">
              <div
                className="flex relative hover:cursor-pointer flex-center mr-3"
                onClick={() => handleChangeRouteCart()}
              >
                <span className="absolute bg-orange-400 rounded-full text-xs text-white ml-4 px-1">
                  {cart.length}
                </span>
                <FiShoppingCart className="text-2xl" />
              </div>

              <CustomButton
                title="Login"
                containerStyles=" xs:hidden bg-white-500 border-b-4 border-orange-500 hover:bg-blue-200 hover:scale-110 text-black font-bold py-2 px-4 rounded duration-1000"
                handleClick={() => {
                  router.push("/login");
                }}
              ></CustomButton>
              <CustomButton
                title="SignUp"
                containerStyles="xs:hidden bg-white-500  border-b-4 border-orange-500 hover:bg-blue-200 hover:scale-110 text-black font-bold py-2 px-4 rounded duration-1000"
                handleClick={() => {
                  router.push("/signup");
                }}
              ></CustomButton>
              <div className="text-3xl inline-flex lg:hidden">
                <Menu>
                  <Menu.Button>
                    <AiOutlineMenu />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                    <div className="px-1 py-1">
                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        {links.map((link) => (
                          <Menu.Item
                            as={Link}
                            key={link.href}
                            href={link.href}
                            className="ui-active:bg-violet-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black group flex w-full items-center rounded-md px-2 py-2 text-sm"
                          >
                            {link.icon &&
                              iconMap[link.icon] &&
                              React.createElement(iconMap[link.icon], {
                                className: "mr-2",
                              })}
                            {link.label}
                          </Menu.Item>
                        ))}
                      </Transition>
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <Dialog open={isOpenDialog} onOpenChange={() => setOpenDialog(false)}>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Tìm Kiếm</DialogTitle>
            </DialogHeader>
            <Input
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm Kiếm ..."
              required={true}
            />
            <DialogFooter>
              <Button type="submit" onClick={handleSearch}>
                Xác Nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

const Category = () => {
  const [isOpenCategory, setOpenCategory] = useState(false);
  const [isOpenTopics, setOpenTopics] = useState(false);
  return (
    <div className="dropdown ml-6">
      <button
        className="dropdown-select text-lg"
        onMouseEnter={() => setOpenCategory(true)}
        onMouseLeave={() => setOpenCategory(false)}
      >
        Categories
      </button>
      {isOpenCategory && (
        <div
          className="dropdown-main"
          onMouseEnter={() => setOpenCategory(true)}
          onMouseLeave={() => setOpenCategory(false)}
        >
          <ul className="dropdown-list">
            <Item
              itemName="Backend"
              hasIcon={true}
              setOpenTopics={setOpenTopics}
            />
            <Item
              itemName="Frontend"
              hasIcon={true}
              setOpenTopics={setOpenTopics}
            />
            <Item
              itemName="Testing"
              hasIcon={true}
              setOpenTopics={setOpenTopics}
            />
            <Item
              itemName="Mobile"
              hasIcon={true}
              setOpenTopics={setOpenTopics}
            />
          </ul>
          {isOpenTopics && (
            <ul
              className="dropdown-list dropdown-list--topics"
              onMouseEnter={() => setOpenTopics(true)}
              onMouseLeave={() => setOpenTopics(false)}
            >
              <h3>Popular Topics</h3>
              <Item itemName="Java" hasIcon={false} />
              <Item itemName="PHP" hasIcon={false} />
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const Item = ({ itemName, hasIcon, setOpenTopics }: any) => {
  return (
    <li
      className="dropdown-item"
      onMouseEnter={() => setOpenTopics(true)}
      onMouseLeave={() => setOpenTopics(false)}
    >
      <span>{itemName}</span>
      {hasIcon && <AiOutlineRight />}
    </li>
  );
};

export default Navbar;
