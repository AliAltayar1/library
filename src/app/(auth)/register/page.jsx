"use client";

// ============================================================================
// IMPORTS
// ============================================================================
import { BookOpen, Eye, EyeClosed, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { register } from "../../../../lib/user/register";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";

// ============================================================================
// REGISTER COMPONENT
// ============================================================================
/**
 * Register Component
 *
 * A registration form for the book library application with the following features:
 * - Full name, email, password, and confirm password inputs
 * - Password visibility toggle for both password fields
 * - Password matching validation
 * - Privacy policy agreement checkbox
 * - Arabic RTL (Right-to-Left) layout support
 *
 * @returns {JSX.Element} The registration form component
 */
const Register = () => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  /**
   * State to track password visibility for both password fields
   * @property {boolean} pass - Controls main password field visibility
   * @property {boolean} conPass - Controls confirm password field visibility
   */
  const [isVisable, setIsVisable] = useState({
    pass: false,
    conPass: false,
  });
  const router = useRouter();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    password2: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { checkAuth } = useAuth();

  const registerFn = async () => {
    setLoading(true);
    try {
      const data = await register(userData);
      await checkAuth();
      toast.success("تم تسجيل الحساب بنجاح");
      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data) {
        setFieldErrors(error.response.data);
        console.log(error.response.data);
      } else {
        toast.error(error.message || "حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // REFS
  // ==========================================================================

  /**
   * Ref to access password input value without causing re-renders
   */
  const password = useRef(null);

  /**
   * Ref to access confirm password input value without causing re-renders
   */
  const confPassword = useRef(null);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Validates that password and confirm password fields match
   * Displays an error toast notification if passwords don't match
   *
   * @function checkPassSimilarity
   */
  function checkPassSimilarity() {
    if (password.current.value !== confPassword.current.value) {
      toast.error(
        "الرجاء التأكد من أن كلمة المرور وتأكيد كلمة المرور متماثلتان"
      );
    }
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <section className="register flex flex-col items-center p-5">
      {/* ====================================================================
          HEADER SECTION
          ==================================================================== */}
      <div className="flex gap-1 items-center">
        <h1 className="text-4xl font-bold text-blue-950">مكتبة الكتب</h1>
        <BookOpen size={40} />
      </div>

      {/* ====================================================================
          PAGE TITLE AND DESCRIPTION
          ==================================================================== */}
      <div className="my-8 text-center">
        <h2 className="text-4xl font-semibold mb-3 text-blue-950">
          إنشاء حساب
        </h2>
        <p className="text-gray-500">انضم إلى مجتمع قرائنا اليوم</p>
      </div>

      {/* ====================================================================
          REGISTRATION FORM
          ==================================================================== */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          registerFn();
        }}
        className="bg-white rounded-2xl border border-gray-300 p-5 sm:p-10 shadow"
      >
        {/* ==================================================================
            FORM HEADER
            ================================================================== */}
        <div className="mb-8">
          <span className="text-blue-950 font-semibold">انشئ حسابًا</span>
          <p className="text-gray-500">
            قم بإنشاء حساب جديد لبدء رحلة القراءة الخاصة بك
          </p>
        </div>

        {/* ==================================================================
            FORM FIELDS CONTAINER
            ================================================================== */}
        <div className="flex flex-col gap-y-5 md:min-w-[500px]">
          <div>
            <label htmlFor="email" className="text-blue-950 font-semibold ">
              عنوان البريد الإلكتروني
            </label>

            <div className="relative mt-1">
              <input
                type="text"
                id="email"
                placeholder="أدخل عنوان بريدك الإلكتروني"
                className="ps-8 border border-gray-300 rounded-md shadow p-2 w-full focus:outline-3 outline-blue-400 transition-all duration-100"
                onChange={(e) => {
                  setUserData({ ...userData, email: e.target.value });
                }}
                value={userData.email}
              />
              <Mail
                size={18}
                color="gray"
                className=" absolute top-2.5 right-2"
              />
            </div>

            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="text-blue-950 font-semibold ">
              اسم المستخدم
            </label>

            <div className="relative mt-1">
              <input
                type="text"
                id="username"
                placeholder="demo_1"
                className="ps-8 border border-gray-300 rounded-md shadow p-2 w-full focus:outline-3 outline-blue-400 transition-all duration-100"
                onChange={(e) => {
                  setUserData({ ...userData, username: e.target.value });
                }}
                value={userData.username}
              />
              <Mail
                size={18}
                color="gray"
                className=" absolute top-2.5 right-2"
              />
            </div>
            {fieldErrors.username && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.username[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="fname" className="text-blue-950 font-semibold ">
              الاسم الاول
            </label>

            <div className="relative mt-1">
              <input
                type="text"
                id="fname"
                placeholder=" الاسم الاول"
                className="ps-8 border border-gray-300 rounded-md shadow p-2 w-full focus:outline-3 outline-blue-400 transition-all duration-100"
                onChange={(e) => {
                  setUserData({ ...userData, first_name: e.target.value });
                }}
                value={userData.first_name}
              />
              <Mail
                size={18}
                color="gray"
                className=" absolute top-2.5 right-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lname" className="text-blue-950 font-semibold ">
              الاسم الاخير
            </label>

            <div className="relative mt-1">
              <input
                type="text"
                id="lname"
                placeholder="الاسم الاخير"
                className="ps-8 border border-gray-300 rounded-md shadow p-2 w-full focus:outline-3 outline-blue-400 transition-all duration-100"
                onChange={(e) => {
                  setUserData({ ...userData, last_name: e.target.value });
                }}
                value={userData.last_name}
              />
              <Mail
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
                ref={password}
                type={`${isVisable.pass ? "text" : "password"}`}
                id="password"
                placeholder="إنشاء كلمة مرور"
                className="ps-8 border border-gray-300 rounded-md shadow p-2 w-full focus:outline-3 outline-blue-400 transition-all duration-100"
                onChange={(e) => {
                  setUserData({ ...userData, password: e.target.value });
                }}
                value={userData.password}
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

            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confpassword"
              className="text-blue-950 font-semibold "
            >
              تأكيد كلمة المرور
            </label>
            <div className="relative mt-1">
              <input
                ref={confPassword}
                type={`${isVisable.pass ? "text" : "password"}`}
                id="confpassword"
                placeholder="تأكيد كلمة مرور"
                className="ps-8 border border-gray-300 rounded-md shadow p-2 w-full focus:outline-3 outline-blue-400 transition-all duration-100"
                onChange={(e) => {
                  setUserData({ ...userData, password2: e.target.value });
                }}
                value={userData.password2}
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
            {fieldErrors.password2 && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password2[0]}
              </p>
            )}
          </div>
        </div>

        {/* ==================================================================
            PRIVACY POLICY AGREEMENT CHECKBOX
            ================================================================== */}
        <div className="flex items-center gap-x-1 my-8">
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
            أوافق على{" "}
            <Link href={"/privacy"} className="text-blue-800">
              سياسة الخصوصية
            </Link>{" "}
            وشروط الخدمة
          </label>
        </div>

        {/* ==================================================================
            SUBMIT BUTTON
            ================================================================== */}
        {loading && <LoadingSpinner />}
        {!loading && (
          <button
            onClick={() => checkPassSimilarity()}
            className="p-2 w-full bg-blue-950 hover:bg-blue-900 rounded-lg text-white font-semibold"
          >
            إنشاء حساب
          </button>
        )}

        {/* ==================================================================
            LOGIN REDIRECT LINK
            ================================================================== */}
        <p className="text-gray-500 text-center mt-8">
          هل لديك حساب بالفعل؟
          <Link href={"/login"} className="text-blue-950 font-semibold">
            {" "}
            سجّل دخولك هنا
          </Link>
        </p>
      </form>
    </section>
  );
};

// ============================================================================
// EXPORT
// ============================================================================
export default Register;
