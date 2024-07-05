import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { IconButton } from "@mui/material";
import { CiSearch } from "react-icons/ci";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { RiVideoAddLine } from "react-icons/ri";
import { FiBell } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { Button } from "@mui/material"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <div className="z-50 w-full md:h-16 h-[8vh] bg-background flex justify-between items-center px-4 fixed">
        <div className="flex items-center ">
          <Sidebar />
          <Link to='/'>
            <img src="youTube.png" alt="logo" className="md:w-28 w-44 cursor-pointer" />
          </Link>
        </div>
        <div className="w-3/4">
          <div className="hidden md:flex items-center justify-center py-10">
            <form className="w-3/5 flex relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-2 px-4 border border-gray-400 rounded-l-full focus:border-blue-600 focus:outline-none focus:shadow-inner"
              />
              <button
                type="submit"
                className="w-1/12 p-2 bg-gray-200 border border-gray-400 border-l-0 rounded-r-full hover:bg-gray-300 focus:outline-none"
              >
                <CiSearch size={25} />
              </button>
            </form>
            <IconButton>
              <KeyboardVoiceIcon
                className="cursor-pointer text-black rounded-full"
                fontSize="medium"
              />
            </IconButton>
          </div>
        </div>
        {isLoggedIn ? (
          <div className="flex md:gap-3 items-center">
            <IconButton>
              <CiSearch className="md:hidden" color="black" />
            </IconButton>
            <IconButton>
              <RiVideoAddLine size={25} className="cursor-pointer" color="black" />
            </IconButton>
            <IconButton>
              <FiBell size={25} className="cursor-pointer" color="black"/>
            </IconButton>
            <DropdownMenu>
              <DropdownMenuTrigger><CgProfile size={25} className="hidden md:block"/></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <IconButton>
              <CgProfile size={25} className="md:hidden" color="black"/>
            </IconButton>
          </div>
        ) : (
          <div className="flex items-center">
          <IconButton>
            <CiSearch className="md:hidden"/>
          </IconButton>
          <Button variant="outlined" className="border-2 rounded-full overflow-hidden">
            <Link to='/authentication' className="md:flex inline md:gap-2 text-xs md:text-inherit items-center rounded-full cursor-pointer">
              <CgProfile size={27} className="hidden md:block"/>
              <div>Sign in</div>
            </Link>
          </Button>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
}

export default Navbar;
