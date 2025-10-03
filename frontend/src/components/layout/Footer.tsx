import React from "react";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaLine, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl">
                <HomeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                HouseMarket
              </span>
            </div>
            <p className="text-slate-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg">
              แพลตฟอร์มซื้อขายบ้านออนไลน์ที่ใหญ่ที่สุดในประเทศไทย
              ค้นหาบ้านในฝันของคุณได้ง่ายๆ ด้วยเทคโนโลยีที่ทันสมัย
            </p>

            {/* Social Media Icons */}
            <div className="mb-4 sm:mb-6">
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                ติดตามเราได้ที่
              </h4>
              <div className="flex space-x-3 sm:space-x-4">
                <a
                  href="#"
                  className="group p-2 sm:p-3 bg-slate-800/50 hover:bg-blue-600 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                  aria-label="Facebook"
                >
                  <FaFacebook className="h-5 w-5 sm:h-6 sm:w-6 text-slate-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="group p-2 sm:p-3 bg-slate-800/50 hover:bg-green-500 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/25"
                  aria-label="Line"
                >
                  <FaLine className="h-5 w-5 sm:h-6 sm:w-6 text-slate-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="group p-2 sm:p-3 bg-slate-800/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
                  aria-label="Instagram"
                >
                  <FaInstagram className="h-5 w-5 sm:h-6 sm:w-6 text-slate-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="group p-2 sm:p-3 bg-slate-800/50 hover:bg-black rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-500/25"
                  aria-label="TikTok"
                >
                  <FaTiktok className="h-5 w-5 sm:h-6 sm:w-6 text-slate-300 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white relative">
              ลิงก์ด่วน
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-10 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  href="/search"
                  className="text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
                >
                  <span className="relative z-10">ค้นหาบ้าน</span>
                  <div className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-blue-500/20 to-transparent transition-all duration-300 rounded"></div>
                </Link>
              </li>
              <li>
                <Link
                  href="/houses/create"
                  className="text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
                >
                  <span className="relative z-10">ลงขายบ้าน</span>
                  <div className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-blue-500/20 to-transparent transition-all duration-300 rounded"></div>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
                >
                  <span className="relative z-10">เกี่ยวกับเรา</span>
                  <div className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-blue-500/20 to-transparent transition-all duration-300 rounded"></div>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
                >
                  <span className="relative z-10">ติดต่อเรา</span>
                  <div className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-blue-500/20 to-transparent transition-all duration-300 rounded"></div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white relative">
              ช่วยเหลือ
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-10 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  href="/help"
                  className="text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
                >
                  <span className="relative z-10">คำถามที่พบบ่อย</span>
                  <div className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-purple-500/20 to-transparent transition-all duration-300 rounded"></div>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
                >
                  <span className="relative z-10">ข้อกำหนดการใช้งาน</span>
                  <div className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-purple-500/20 to-transparent transition-all duration-300 rounded"></div>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
                >
                  <span className="relative z-10">นโยบายความเป็นส่วนตัว</span>
                  <div className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-purple-500/20 to-transparent transition-all duration-300 rounded"></div>
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2 transform inline-block group relative"
                >
                  <span className="relative z-10">ศูนย์ช่วยเหลือ</span>
                  <div className="absolute inset-0 w-0 group-hover:w-full h-full bg-gradient-to-r from-purple-500/20 to-transparent transition-all duration-300 rounded"></div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-center sm:text-left">
            <p className="text-slate-400 text-sm sm:text-base">
              © 2025 HouseMarket. สงวนลิขสิทธิ์ทุกประการ
            </p>
            <div className="flex flex-col xs:flex-row items-center space-y-2 xs:space-y-0 xs:space-x-4 lg:space-x-6 text-xs sm:text-sm text-slate-400">
              <span>Made with ❤️ in Thailand</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>ระบบพร้อมใช้งาน</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
