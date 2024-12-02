import { Prompt } from "next/font/google";
import { Aside } from "@/components/Aside";
import "./globals.css";
import { SearchForm } from "@/components/SearchForm";
import React from "react";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Code Connect",
  description: "Uma rede social para devs!",
};

const prompt = Prompt({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});
// eslint-disable-next-line react/prop-types
export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={prompt.className}>
      <ReactQueryProvider>
        <body>
          <div className="app-container">
            <div>
              <Aside />
            </div>
            <div className="main-content">
              <SearchForm />
              {children}
            </div>
          </div>
          <ToastContainer autoClose={2000} />
          <ReactQueryDevtools />
        </body>
      </ReactQueryProvider>
    </html>
  );
}
