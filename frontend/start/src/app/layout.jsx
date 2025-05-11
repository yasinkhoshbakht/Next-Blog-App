import vazirFont from "@/constants/localFont";
import "@/styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirFont.variable} font-sans`}>{children}</body>
    </html>
  );
}
