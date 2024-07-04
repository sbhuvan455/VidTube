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

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="w-full h-16 bg-background flex justify-between items-center px-4">
      <div className="flex items-center ">
        <Sidebar />
        <img src="youTube.png" alt="logo" className="w-28 cursor-pointer" />
      </div>
      <div className="w-3/4">
        <div className="flex items-center justify-center py-10">
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
        <div className="flex gap-3">
          <IconButton>
            <RiVideoAddLine size={25} className="cursor-pointer" />
          </IconButton>
          <IconButton>
            <FiBell size={25} className="cursor-pointer" />
          </IconButton>
          <DropdownMenu>
            <DropdownMenuTrigger><CgProfile size={27}/></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button className="border-2 rounded-full overflow-hidden">
          <div className="flex gap-2 items-center border-blue-600 border-2 p-1 rounded-full cursor-pointer">
            <CgProfile size={27} />
            <div>Sign in</div>
          </div>
        </Button>
      )}
    </div>
  );
}

export default Navbar;
