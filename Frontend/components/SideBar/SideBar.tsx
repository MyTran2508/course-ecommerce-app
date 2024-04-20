"use client";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsFillFilePersonFill } from "react-icons/bs";
import { GrShieldSecurity } from "react-icons/gr";
import { IoIosCloseCircleOutline } from "react-icons/io";

function SideBar() {
  const [activeLink, setActiveLink] = useState<number>(0);
  const [isOpenMenu, setOpenMenu] = useState<boolean>(true);

  const handleLinkClick = (index: number) => {
    setActiveLink(index);
    handleOpenMenu();
  };

  const handleOpenMenu = () => {
    if (window.innerWidth <= 575) {
      setOpenMenu(!isOpenMenu);
    }
  };

  return (
    <Fragment>
      {isOpenMenu ? (
        <Fragment>
          <div className="mx-20 xs:mx-0 xs:absolute xs:z-20 h-full">
            <div className="flex h-full">
              <div className="p-4">
                <div className="sticky top-[96px]  ">
                  <div className="flex-between items-center mb-4">
                    <h2 className="text-lg font-bold">Cài Đặt</h2>
                    <IoIosCloseCircleOutline
                      onClick={() => handleOpenMenu()}
                      className="lg:hidden"
                    />
                  </div>
                  <nav className="flex flex-col w-max text-md">
                    <Link
                      href="/user/personal"
                      className={`p-2 hover:bg-gray-300 flex gap-2 mb-2 hover:rounded-md py-3 ${
                        activeLink === 0 ? "bg-gray-300 rounded-md" : ""
                      }`}
                      onClick={() => handleLinkClick(0)}
                    >
                      <div className="flex items-center gap-2">
                        <BsFillFilePersonFill />
                        Trang thông tin cá nhân
                      </div>
                    </Link>

                    <Link
                      href="/user/security"
                      className={`p-2 hover:bg-gray-300 flex gap-2 mb-2 hover:rounded-md py-3 ${
                        activeLink === 1 ? "bg-gray-300 rounded-md" : ""
                      }`}
                      onClick={() => handleLinkClick(1)}
                    >
                      <div className="flex items-center gap-2">
                        <GrShieldSecurity />
                        Trang bảo mật
                      </div>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        <div
          className="mx-2 lg:hidden absolute mt-5 z-20"
          onClick={() => handleOpenMenu()}
        >
          <AiOutlineMenu className="text-3xl" />
        </div>
      )}
    </Fragment>
  );
}

export default SideBar;
