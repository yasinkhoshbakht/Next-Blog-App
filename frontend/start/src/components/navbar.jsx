"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/ui/Spinner";
import SpinnerMini from "@/ui/SpinnerMini";

function Navbar() {
  const { user, isAuthenticated, loading } = useAuth();

  return (
    <nav className="bg-indigo-100 p-4 rounded-md shadow-md mb-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <ul className="flex flex-wrap gap-6 justify-center flex-grow items-center">
          <li>
            <Link
              href="/"
              className="block py-2 hover:text-secondary-900 transition-all ease-out"
            >
              خانه
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
              className="block py-2 hover:text-secondary-900 transition-all ease-out"
            >
              بلاگ
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="block py-2 hover:text-secondary-900 transition-all ease-out"
            >
              داشبورد
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block py-2 hover:text-secondary-900 transition-all ease-out"
            >
              درباره ما
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block py-2 hover:text-secondary-900 transition-all ease-out"
            >
              تماس با ما
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-3">
          {loading ? (
            <SpinnerMini />
          ) : isAuthenticated && user ? (
            <Link
              href="/profile"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow"
            >
              پروفایل
            </Link>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
