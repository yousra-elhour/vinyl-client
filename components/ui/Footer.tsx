"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <>
      <footer className="2xl:px-20 xl:px-14 lg:px-12 sm:px-4 px-6 pt-20 pb-20">
        <hr className="pb-12 border-gray-600" />
        <div className="max-w-screen ">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <Link href={"/"}>
                <Logo className="text-3xl" />
              </Link>

              <p className="max-w-xs mt-2 text-sm text-gray-500">
                Where Vinyl Dreams Come To Life <br />
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-medium">Company</p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-500">
                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    About{" "}
                  </Link>
                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    Meet the Team{" "}
                  </Link>

                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    Careers{" "}
                  </Link>
                </nav>
              </div>
              <div>
                <p className="font-medium">Services</p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-500">
                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    Company Review{" "}
                  </Link>

                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    Refund{" "}
                  </Link>
                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    Shipping{" "}
                  </Link>
                </nav>
              </div>
              <div>
                <p className="font-medium">Helpful Links</p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-500">
                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    Contact{" "}
                  </Link>
                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    FAQs{" "}
                  </Link>
                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    Live Chat{" "}
                  </Link>
                </nav>
              </div>
              <div>
                <p className="font-medium">Legal</p>
                <nav className="flex flex-col mt-4 space-y-2 text-sm text-gray-500">
                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    Privacy Policy{" "}
                  </Link>
                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    Terms &amp; Conditions{" "}
                  </Link>
                  <Link className="hover:opacity-75" href="/">
                    {" "}
                    Returns Policy{" "}
                  </Link>
                </nav>
              </div>
            </div>
          </div>
          <p className="mt-8 text-xs text-gray-800">© 2023 YOUSRA ELHOUR</p>
        </div>
      </footer>
    </>
  );
}
