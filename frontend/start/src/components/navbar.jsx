"use client";
import React from "react";
import NavLink from "./NavLink";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-indigo-100 p-4 rounded-md shadow-md mb-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <ul className="flex flex-wrap gap-6 justify-center flex-grow">
          <li>
            <NavLink path="/">خانه</NavLink>
          </li>
          <li>
            <NavLink path="/blogs">بلاگ</NavLink>
          </li>
          <li>
            <NavLink path="/dashboard">داشبورد</NavLink>
          </li>
          <li>
            <NavLink path="/about">درباره ما</NavLink>
          </li>
          <li>
            <NavLink path="/contact">تماس با ما</NavLink>
          </li>
        </ul>
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="px-4 py-2 rounded-xl border border-indigo-500 text-indigo-600 hover:bg-indigo-200 transition"
          >
            ورود
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow"
          >
            ثبت‌ نام
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
