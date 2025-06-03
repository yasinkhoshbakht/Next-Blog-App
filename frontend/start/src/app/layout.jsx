import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import vazirFont from "@/constants/localFont";
import "@/styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirFont.variable} font-sans`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-6">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
