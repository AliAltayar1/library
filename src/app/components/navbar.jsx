"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  BookOpen,
  BotMessageSquare,
  Heart,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import Button from "./button";
import CloseIcon from "@mui/icons-material/Close";
import ReorderIcon from "@mui/icons-material/Reorder";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { logout } from "../../../lib/user/logout";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logoutchk } = useAuth();

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: BookOpen },
    { href: "/books", label: "الكتب", icon: BookOpen },
    { href: "/favorites", label: "المفضلة", icon: Heart },
    {
      href: "/profile",
      label: "الملف الشخصي",
      icon: User,
    },
    { href: "/chat", label: "النموذج الذكي", icon: BotMessageSquare },
  ];

  const logoutFn = async () => {
    try {
      const res = await logout();
      await logoutchk();
      toast.success("تم تسجيل الخروج بنجاح");
    } catch (error) {
      toast.error("حدث خطأ اثناء تسجيل الخروج " + error.message);
    }
  };

  return (
    <nav className="lg:px-6 px-4 bg-gray-100 text-gray-600 ">
      <div className="flex justify-between items-center py-5 ">
        <div className="logo text-2xl flex items-center gap-x-1.5 font-medium whitespace-nowrap">
          <span>
            <BookOpen />
          </span>
          مكتبة الكتب
        </div>

        <div className="links lg:flex items-center gap-x-4 hidden">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                className={`flex items-center gap-x-1 ${
                  pathname == link.href ? " border-b pb-1" : ""
                }  hover:text-gray-400`}
                href={link.href}
                key={link.href}
              >
                <Icon
                  className={`${pathname == link.href ? "text-gray-600" : ""}`}
                />
                <span
                  className={`${
                    pathname == link.href ? "text-gray-600 font-semibold" : ""
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}

          {user?.isAdmin && (
            <Link
              className={`flex items-center gap-x-1 ${
                pathname == "/admin" ? " border-b pb-1" : ""
              }  hover:text-gray-400`}
              href={"/admin"}
            >
              <LayoutDashboard
                className={`${pathname == "/admin" ? "text-gray-600" : ""}`}
              />
              <span
                className={`${
                  pathname == "/admin" ? "text-gray-600 font-semibold" : ""
                }`}
              >
                لوحة التحكم
              </span>
            </Link>
          )}
        </div>

        {!user?.isValid && (
          <div className="auth lg:flex gap-x-3 hidden ">
            <Link
              href={"/login"}
              className="bg-accent hover:bg-accent-dark rounded-xl px-4 py-2 cursor-pointer transform transition-all duration-300  whitespace-nowrap text-white"
            >
              تسجيل الدخول
            </Link>
            <Link
              href={"/register"}
              className="bg-primary-light hover:bg-hover rounded-xl px-4 py-2 cursor-pointer transform transition-all duration-300  whitespace-nowrap text-white"
            >
              إنشاء حساب
            </Link>
          </div>
        )}

        {user?.isValid && (
          <Link
            href={"/login"}
            onClick={() => logoutFn()}
            className="hover:bg-accent hover:text-white transition-colors duration-150 lg:flex items-center gap-2 py-2 px-3 border border-gray-300 shadow rounded-lg hidden "
          >
            <LogOut />
            تسجيل الخروج
          </Link>
        )}

        <button
          className="lg:hidden block cursor-pointer hover:bg-primary hover:text-white transition-colors duration-200 p-2 rounded-xl  "
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <CloseIcon /> : <ReorderIcon />}
        </button>
      </div>

      {isOpen && (
        <ul className="lg:hidden pb-10">
          <div className="links flex flex-col items-start gap-y-2 ">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  className={`flex items-center gap-x-1 rounded-xl w-full p-2 text-gray-500 hover:text-black hover:bg-gray-300 ${
                    pathname == `${link.href}` ? "bg-gray-200" : ""
                  } `}
                  href={link.href}
                  key={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon />
                  <span className="">{link.label}</span>
                </Link>
              );
            })}
            {user?.isAdmin && (
              <Link
                className={`flex items-center gap-x-1 rounded-xl w-full p-2 text-gray-500 hover:text-black hover:bg-gray-300 ${
                  pathname == "/admin" ? "bg-gray-200" : ""
                }  `}
                href={"/admin"}
              >
                <LayoutDashboard
                  className={`${pathname == "/admin" ? "text-gray-600" : ""}`}
                />
                <span
                  className={`${
                    pathname == "/admin" ? "text-gray-600 font-semibold" : ""
                  }`}
                >
                  لوحة التحكم
                </span>
              </Link>
            )}
          </div>

          {!user?.isValid && (
            <div className="auth flex flex-col gap-y-1 mt-8">
              <Link
                href={"/login"}
                className="bg-accent hover:bg-accent-dark rounded-xl px-4 py-2 cursor-pointer transform transition-all duration-300  whitespace-nowrap text-white text-center"
              >
                تسجيل الدخول
              </Link>
              <Link
                href={"/register"}
                className="bg-primary-light hover:bg-hover rounded-xl px-4 py-2 cursor-pointer transform transition-all duration-300  whitespace-nowrap text-white text-center"
              >
                إنشاء حساب
              </Link>
            </div>
          )}

          {user?.isValid && (
            <Link
              href={"/login"}
              onClick={() => logoutFn()}
              className="mt-5 hover:bg-accent hover:text-white transition-colors duration-150 flex items-center gap-2 py-2 px-3 border border-gray-300 shadow rounded-lg justify-center"
            >
              <LogOut />
              تسجيل الخروج
            </Link>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
