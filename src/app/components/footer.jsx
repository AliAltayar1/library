import {
  BookOpen,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const navLinks = [
  { href: "/", label: "الرئيسية", icon: BookOpen },
  { href: "/books", label: "الكتب", icon: BookOpen },
  { href: "/favorites", label: "المفضلة", icon: Heart },
  { href: "/profile", label: "الملف الشخصي", icon: User },
];

const contactItems = [
  { icon: MapPin, text: "شارع المكتبة 123، مدينة الكتب، ص.ب 12345" },
  { icon: Phone, text: "+971 11 123 4567" },
  { icon: Mail, text: "info@libraryapp.com" },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      dir="rtl"
      style={{
        background: "linear-gradient(180deg, #0F1B3C 0%, #091228 100%)",
      }}
    >
      {/* Gold accent top border */}
      <div
        className="h-0.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #D4930A, #f6c54e, #D4930A, transparent)",
        }}
      />

      <div className="container py-16">
        {/* ── Main Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/library-logo.jpeg"
                  alt="خير جليس"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-bold text-lg">خير جليس</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-[220px]">
              بوابتك الرقمية إلى المعرفة. اكتشف واستعر واستكشف آلاف الكتب من
              مجموعتنا الشاملة.
            </p>

            {/* Social icons */}
            <div className="flex gap-2 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-white/15 flex items-center justify-center text-white/50 hover:text-amber-400 hover:border-amber-400/40 hover:bg-amber-400/10 transition-all duration-200"
                >
                  <Icon size={17} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span
                className="block w-4 h-0.5 rounded bg-accent"
              />
              روابط سريعة
            </h3>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-white/55 hover:text-amber-400 text-sm transition-colors duration-200 group"
                  >
                    <Icon
                      size={14}
                      className="group-hover:scale-110 transition-transform duration-200"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span
                className="block w-4 h-0.5 rounded bg-accent"
              />
              اتصل بنا
            </h3>
            <ul className="flex flex-col gap-3">
              {contactItems.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-2.5 text-white/55 text-sm"
                >
                  <Icon
                    size={15}
                    className="text-amber-500/80 mt-0.5 flex-shrink-0"
                  />
                  <span className="leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span
                className="block w-4 h-0.5 rounded bg-accent"
              />
              ابدأ القراءة
            </h3>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">
              انضم إلى آلاف القراء واستمتع بالوصول إلى مكتبتنا الشاملة.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium bg-amber-400 hover:bg-amber-500 text-primary px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <BookOpen size={15} />
              تصفح الكتب
            </Link>
          </div>
        </div>

        {/* ── Bottom Bar ───────────────────────────────────────────── */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/35 text-sm">
          <p>© {year} خير جليس. جميع الحقوق محفوظة.</p>
          <div className="flex gap-5">
            <Link
              href="#"
              className="hover:text-amber-400 transition-colors duration-200"
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="#"
              className="hover:text-amber-400 transition-colors duration-200"
            >
              شروط الخدمة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
