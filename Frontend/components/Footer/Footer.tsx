import Link from "next/link";
import React from "react";
import "../style/footer.scss";
import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faInstagram,
  faLinkedinIn,
  faTwitter,
  faYoutube,
  fab,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

library.add(fab, faCoffee);

function Footer() {
  return (
    // <footer className="flex justify-between border-t-2 p-2 max-md:flex-col mb-2 xs:text-[8px] xs:mb-10 ">
    //   <p>Copy right @ 2023 | ALL Right Reserved</p>
    //   <div className="flex gap-x-10">
    //     <Link href={"/"}>Terms & Conditions</Link>
    //     <Link href={"/"}>Privacy Policy</Link>
    //   </div>
    // </footer>
    <footer className="py-4 mt-[200px] ">
      <div className="content">
        <div className="top">
          <div className="top__logo">
            <div className="image">
              <FontAwesomeIcon icon="fab fa-slack" />
            </div>
            <span>E-LEARNING</span>
          </div>
          <div className="top__media">
            <Link href={"/"}>
              <div className="icon facebook">
                <FontAwesomeIcon icon="fab fa-facebook" />
              </div>
            </Link>
            <Link href={"/"}>
              <div className="icon twitter">
                <FontAwesomeIcon icon="fa-brands fa-twitter" />
              </div>
            </Link>
            <Link href={"/"}>
              <div className="icon instagram">
                <FontAwesomeIcon icon="fa-brands fa-instagram" />
              </div>
            </Link>
            <Link href={"/"}>
              <div className="icon linkedin">
                <FontAwesomeIcon icon="fa-brands fa-linkedin-in" />
              </div>
            </Link>
            <Link href={"/"}>
              <div className="icon youtube">
                <FontAwesomeIcon icon="fa-brands fa-youtube" />
              </div>
            </Link>
          </div>
        </div>
        <div className="body">
          <ul className="body__box">
            <li>Company</li>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/"}>Contact us</Link>
            </li>
            <li>
              <Link href={"/"}>About us</Link>
            </li>
            <li>
              <Link href={"/"}>Get started</Link>
            </li>
          </ul>
          <ul className="body__box">
            <li>Courses</li>
            <li>
              <Link href={"/"}>Game Development</Link>
            </li>
            <li>
              <Link href={"/"}>Web Development</Link>
            </li>
            <li>
              <Link href={"/"}>Mobile Development</Link>
            </li>
            <li>
              <Link href={"/"}>Software Testing</Link>
            </li>
          </ul>
          <ul className="body__box">
            <li>Account</li>
            <li>
              <Link href={"/user/security"}>Profile</Link>
            </li>
            <li>
              <Link href={"/"}>My account</Link>
            </li>
            <li>
              <Link href={"/cart"}>Shopping cart</Link>
            </li>
            <li>
              <Link href={"/user/personal"}>Change password</Link>
            </li>
          </ul>
          <ul className="body__box body__box--input">
            <li>Subscribe</li>
            <li>
              <input type="text" placeholder="Enter your email" />
            </li>
            <li>
              <button>Subscribe</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="policy">
        <div className="policy__details">
          <span>Copy right @ 2023 | ALL Right Reserved</span>
          <Link href={"/"}>Privacy policy</Link>
          <Link href={"/"}>Terms & condition</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
