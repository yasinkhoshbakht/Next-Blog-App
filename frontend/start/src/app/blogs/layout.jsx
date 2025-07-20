import React from "react";
import CategoryList from "./_components/categoryList";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col p-6 bg-white">
      <h1 className="text-2xl font-extrabold mb-10 text-gray-800 border-b-4 border-indigo-600 pb-3">
        لیست بلاگ ها
      </h1>
      <div className="flex flex-1 gap-10">
        <aside className="w-full max-w-xs text-gray-600 space-y-6 bg-indigo-50 p-5 rounded-md shadow-inner overflow-auto">
          <CategoryList />
        </aside>
        <main className="flex-1 bg-gray-50 p-6 rounded-md shadow-inner overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
