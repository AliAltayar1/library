import {
  BookOpen,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const navLinks = [
    { href: "/", label: "الرئيسية", icon: BookOpen },
    { href: "/books", label: "الكتب", icon: BookOpen },
    { href: "/favorites", label: "المفضلة", icon: Heart },
    {
      href: "/profile",
      label: "الملف الشخصي",
      icon: User,
    },
  ];

  return (
    <footer className="bg-gray-100 py-20 px-8 ">
      <div className="flex flex-wrap gap-x-10 items-center md:justify-evenly flex-col md:flex-row md:items-start border-b border-gray-300 ">
        <section className="mb-10">
          <div className="logo flex items-center gap-x-2 mb-3 justify-center">
            <span className="">
              <BookOpen className="w-8 h-8" />
            </span>
            <span className="text-xl font-semibold">مكتبة الكتب</span>
          </div>
          <p className="text-gray-500 max-w-2xs text-center">
            بوابتك الرقمية إلى المعرفة. اكتشف واستعر واستكشف آلاف الكتب من
            مجموعتنا الشاملة.
          </p>
        </section>

        <section className="quick-links mb-10 text-center">
          <h3 className="mb-5 font-semibold">روابط سريعة</h3>
          <ul className="">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 flex gap-x-1 items-center justify-center mb-2 hover:text-gray-400"
                >
                  <span>
                    <Icon width={18} />
                  </span>
                  <li className="">{link.label}</li>
                </Link>
              );
            })}
          </ul>
        </section>

        <section className="contact-us mb-10 text-center">
          <h3 className="font-semibold mb-5">اتصل بنا</h3>
          <div className="text-gray-500">
            <div className="flex gap-x-1 mb-3  justify-center">
              <span>
                <MapPin width={18} />
              </span>
              <span>شارع المكتبة 123، مدينة الكتب، ص.ب 12345</span>
            </div>
            <div className="flex gap-x-1 mb-3  justify-center ">
              <span>
                <Phone width={18} />
              </span>
              <span>+971 11 123 4567</span>
            </div>
            <div className="flex gap-x-1 mb-3 justify-center">
              <span>
                <Mail width={18} />
              </span>
              <span>info@libraryapp.com</span>
            </div>
          </div>
        </section>

        <section className="follow-us pb-10 text-center">
          <h3 className="mb-5 font-semibold">تابعنا</h3>
          <div className="flex gap-x-2 items-center text-gray-500 ">
            <Link href={""} className="hover:text-gray-400">
              <Instagram size={25} />
            </Link>
            <Link href={""} className="hover:text-gray-400">
              <Facebook size={25} />
            </Link>
            <Link href={""} className="hover:text-gray-400">
              <X size={25} strokeWidth={3} />
            </Link>
          </div>
        </section>
      </div>

      <section className="copy-rights text-gray-500 text-center pt-20">
        <p>© 2024 مكتبة الكتب. جميع الحقوق محفوظة.</p>
        <div>
          <Link className="me-8 hover:text-gray-400" href={""}>
            سياسة الخصوصية
          </Link>
          <Link className="hover:text-gray-400" href={""}>
            شروط الخدمة
          </Link>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
