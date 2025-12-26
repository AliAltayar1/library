"use client";
import { BookOpen, Eye, EyeClosed, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { login } from "../../../../lib/user/login";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { useAuth } from "@/app/components/AuthContext";
import { setToken } from "../../../../lib/getToken";

const Login = () => {
  const [isVisable, setIsVisable] = useState({
    pass: false,
    conPass: false,
  });

  const [userData, setUserData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [isRememberMe, setIsRememberMe] = useState(false);
  const loginFn = async () => {
    setLoading(true);
    try {
      const data = await login(userData);

      setToken(data.status.token, isRememberMe);

      await checkAuth();
      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ اثناء تسجيل الدخول " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register flex flex-col items-center p-5 my-10">
      <div className="flex gap-1 items-center ">
        <h1 className="text-4xl font-bold text-blue-950">مكتبة الكتب</h1>
        <BookOpen size={40} />
      </div>

      <div className="my-8 text-center">
        <h2 className="text-4xl font-semibold mb-3 text-blue-950">
          مرحبًا بعودتك
        </h2>
        <p className="text-gray-500">
          قم بتسجيل الدخول إلى حسابك لمواصلة القراءة
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginFn();
        }}
        className="bg-white rounded-2xl border border-gray-300 p-5 sm:p-10 shadow"
      >
        <div className="mb-8">
          <span className="text-blue-950 font-semibold">تسجيل الدخول</span>

          <p className="text-gray-500">
            أدخل البيانات الخاصة بك للوصول إلى حسابك
          </p>
        </div>

        <div className="flex flex-col gap-y-5 md:min-w-[500px]">
          <div>
            <label htmlFor="username" className="text-blue-950 font-semibold ">
              اسم المستخدم او البريد الالكتروني{" "}
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                id="username"
                placeholder="ex: demo or demo@mail.com"
                className="ps-8 border border-gray-300 rounded-md shadow p-2 w-full focus:outline-3 outline-blue-400 transition-all duration-100"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    identifier: e.target.value,
                  });
                }}
                required
                value={userData.identifier}
              />
              {console.log(userData)}
              <User
                size={18}
                color="gray"
                className=" absolute top-2.5 right-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-blue-950 font-semibold ">
              كلمة المرور
            </label>
            <div className="relative mt-1">
              <input
                type={`${isVisable.pass ? "text" : "password"}`}
                id="password"
                placeholder="ادخل كلمة المرور"
                className="ps-8 border border-gray-300 rounded-md shadow p-2 w-full focus:outline-3 outline-blue-400 transition-all duration-100"
                onChange={(e) => {
                  setUserData({ ...userData, password: e.target.value });
                }}
                value={userData.password}
                required
              />
              <Lock
                size={18}
                color="gray"
                className=" absolute top-2.5 right-2"
              />
              {isVisable.pass ? (
                <Eye
                  onClick={() => {
                    setIsVisable({ ...isVisable, pass: false });
                  }}
                  size={18}
                  className="absolute top-3 left-3 hover:text-blue-950 text-gray-400 cursor-pointer"
                />
              ) : (
                <EyeClosed
                  onClick={() => {
                    setIsVisable({ ...isVisable, pass: true });
                  }}
                  size={18}
                  className="absolute top-3 left-3 hover:text-blue-950 text-gray-400 cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-x-2 mt-4 mb-6 w-fit"
          onClick={() => setIsRememberMe(!isRememberMe)}
        >
          <input
            type="checkbox"
            name="remember"
            id="remember"
            className="w-4 h-4 cursor-pointer accent-blue-950"
          />
          <label
            htmlFor="remember"
            className="text-blue-950 font-semibold cursor-pointer select-none"
          >
            تذكرني
          </label>
        </div>
        {/* <div className="flex items-center justify-between gap-x-3 my-8"></div> */}

        {loading && <LoadingSpinner />}
        {!loading && (
          <button className="p-2 w-full block text-center bg-primary-light hover:bg-hover-dark rounded-lg text-white font-semibold">
            سجل الدخول
          </button>
        )}

        <p className="text-gray-500 text-center mt-8">
          ليس لديك حساب؟
          <Link href={"/register"} className="text-blue-950 font-semibold">
            {" "}
            سجل هنا
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
