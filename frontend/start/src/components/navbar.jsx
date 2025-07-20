"use client";
import React from "react";
import NavLink from "./NavLink";

function Navbar() {
  return (
    <nav className="bg-indigo-100 p-4 rounded-md shadow-md mb-6">
      <ul className="flex flex-wrap gap-6 justify-center">
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
    </nav>
  );
}

export default Navbar;
