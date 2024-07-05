import React from 'react'
import { IoMdHome } from "react-icons/io";
import { HiOutlineBolt } from "react-icons/hi2";
import { PiVideoLight } from "react-icons/pi";
import { MdOutlineAccountBox } from "react-icons/md";
import { Button } from "@mui/material"

function Home() {

  const List1 = [
    {
      name: 'Home',
      icon: <IoMdHome size={30} color='black'/>
    },
    {
      name: 'Shorts',
      icon: <HiOutlineBolt size={30} color='black'/>
    },
    {
      name: 'Subscriptions',
      icon: <PiVideoLight size={30} color='black'/>
    },
    {
      name: 'You',
      icon: <MdOutlineAccountBox size={30} color='black'/>
    }
  ]

  return (
    <div>
      <div className='h-[100vh] fixed md:flex flex-col items-center pt-20 hidden gap-4'>
        {List1.map((list, index) => {
          return <Button key={index} color='inherit'>
                  <div className='flex flex-col justify-center items-center'>
                    {list.icon}
                    <div className='font-extralight text-xs text-black font-sans'>{list.name}</div>
                  </div>
                </Button>
        })}
      </div>
    </div>
  )
}

export default Home
