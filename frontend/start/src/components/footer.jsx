"use client";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-indigo-100 text-indigo-800 mt-12 py-6 px-4 rounded-md shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">
          © {new Date().getFullYear()} تمام حقوق محفوظ است.
        </div>
        <div className="flex gap-6 text-sm">
          <Link
            href="/privacy"
            className="hover:text-indigo-600 transition-colors duration-300"
          >
            حریم خصوصی
          </Link>
          <Link
            href="/terms"
            className="hover:text-indigo-600 transition-colors duration-300"
          >
            قوانین
          </Link>
          <Link
            href="/contact"
            className="hover:text-indigo-600 transition-colors duration-300"
          >
            تماس با ما
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
