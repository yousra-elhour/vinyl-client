"use client";

import React from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useState } from "react";
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Logo from "./Logo";
import Link from "next/link";
import SideCart from "./SideCart";
import { Genre } from "@/types";
import { usePathname } from "next/navigation";
import useCart from "@/hooks/use-cart";
import { AnimatePresence, motion } from "framer-motion";

interface NavBarProps {
  className?: string;
  backgroundColor?: string;
  genres: Genre[];
}

interface NavListMenuProps {
  genres: Genre[];
}

interface NavLisProps {
  genres: Genre[];
}

function NavListMenu({ genres }: NavListMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const [textColor, setTextColor] = React.useState("");

  const pathname = usePathname();

  const routes = genres.map((route) => ({
    href: `/genre/${route.id}`,
    label: route.name,
    active: pathname === `/genre/${route.id}`,
  }));

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setTextColor(
        window.innerWidth <= 959 ? "text-white items-start" : "text-black"
      );
      const handleResize = () => {
        setTextColor(
          window.innerWidth <= 959 ? "text-white items-start" : "text-black"
        );
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const renderItems = routes.map((route) => (
    <Link href={route.href} key={route.href}>
      <MenuItem className="flex gap-3 rounded-lg flex-col">
        <p className={`text-md font-normal ${textColor}`}>{route.label}</p>
      </MenuItem>
    </Link>
  ));

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <div className="font-normal text-white">
            <ListItem
              className=" gap-2 py-2 pr-4 "
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Genres
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </div>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block ">
          <ul className="grid gap-y-2 focus-visible:outline-none ">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}

function NavList({ genres }: NavLisProps) {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1 lg:gap-14 text-primary items-start  ">
      <NavListMenu genres={genres} />

      <Link href="/list-page" className="font-normal">
        <ListItem className="flex items-start  gap-2 py-2 pr-4">
          Buy Vinyl
        </ListItem>
      </Link>

      <Link href="/shortlist" className="font-normal">
        <ListItem className="flex items-start gap-2 py-2 pr-4">
          Shortlist
        </ListItem>
      </Link>
    </List>
  );
}

const NavBar: React.FC<NavBarProps> = ({
  className,
  backgroundColor,
  genres,
}) => {
  const [openNav, setOpenNav] = React.useState(false);

  const [showSearchInput, setShowSearchInput] = useState(false);

  const [openSideCart, setOpenSideCart] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");

  const cart = useCart();

  const handleSearchIconClick = () => {
    setShowSearchInput(true);
  };

  const handleSearch = () => {
    // Redirect to /list-page with the search query
    window.location.href = `/list-page?search=${searchKeyword}`;
  };

  const ref = useOutsideClick(() => {
    setShowSearchInput(false);
  });

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <nav
      style={{ backgroundColor: `${backgroundColor}` }}
      className={`max-w-screen 2xl:px-20 xl:px-14 lg:px-12 sm:px-4 px-6 py-8 shadow-none border-none bg-opacity-100 sticky ${className}`}
    >
      {/* {genres.map((genre) => (
        <div>{genre.name}</div>
      ))} */}

      <div className="flex items-center justify-between text-primary ">
        <Link href="/">
          <Logo className="mr-4 py-2 lg:ml-2 text-2xl" />
        </Link>

        <div className="hidden lg:block">
          <NavList genres={genres} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 5, opacity: { ease: "linear" } }}
          className={`flex gap-5 items-center relative   ${
            showSearchInput ? " border-white border rounded-md gap-0" : ""
          }`}
        >
          {showSearchInput ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 5, opacity: { ease: "linear" } }}
                exit={{ opacity: 0 }}
                ref={ref}
                className={` p-1.5 flex  ${showSearchInput ? " right-0" : ""}`}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-1 py-1 bg-transparent lg:w-[10cqw] md:w-[20cqw] sm:w-[25cqw] w-[25cqw] text-white focus:outline-none"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <button
                  title="Search"
                  onClick={handleSearch}
                  className={`pl-1.5 z-20  ${
                    showSearchInput ? " border-white border-l" : "hidden"
                  }`}
                >
                  <MagnifyingGlassIcon className="h-[25px] w-[25px] cursor-pointer " />
                </button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <button
              title="Search"
              onClick={handleSearchIconClick}
              className={` z-20  ${showSearchInput ? "hidden" : ""}`}
            >
              <MagnifyingGlassIcon className="h-[25px] w-[25px] cursor-pointer " />
            </button>
          )}

          {!showSearchInput && (
            <button
              title="Cart"
              className=" relative"
              onClick={() => {
                setOpenSideCart(true);
              }}
            >
              <ShoppingCartIcon className="h-[25px] w-[25px] cursor-pointer" />

              <div className="bg-white rounded-full text-black absolute bottom-3 left-4 h-4 w-4 text-center text-xs font-light">
                {cart.items.length}
              </div>
            </button>
          )}

          {!showSearchInput && (
            <IconButton
              variant="text"
              color="blue-gray"
              className="lg:hidden"
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <XMarkIcon className="h-6 w-6" color="white" strokeWidth={2} />
              ) : (
                <Bars3Icon className="h-6 w-6" color="white" strokeWidth={2} />
              )}
            </IconButton>
          )}
        </motion.div>
      </div>
      <Collapse open={openNav}>
        <NavList genres={genres} />
      </Collapse>
      <SideCart open={openSideCart} setOpen={setOpenSideCart} />
    </nav>
  );
};
export default NavBar;
