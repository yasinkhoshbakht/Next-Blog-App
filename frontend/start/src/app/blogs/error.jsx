"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";

export default function Error() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-2xl font-bold text-secondary-700 mb-2">
        محتوای مورد نظر شما یافت نشد
      </h1>
      <p className="text-secondary-500 text-sm">
        آدرس وارد شده نادرست است یا این محتوا دیگر وجود ندارد.
      </p>
    </div>
  );
}
