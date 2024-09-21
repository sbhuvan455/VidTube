"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Play, Search, Menu, X, Clock, Users, Home, Tv2, Settings, TextSelect, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store"

export default function Navbar() {

    const router = useRouter()

    const {
        currentUser,
        isSignedIn,
        signOut
    } = useUserStore();

    const handleSignIn = () => {
        router.push('/login')
    }

    const handleSignOut = () => {
        signOut()
    }

    return (
        <nav className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center">
                <Play className="h-8 w-8 text-primary" />
                <span className="ml-2 text-2xl font-bold text-primary hidden md:block">VidTube</span>
                </Link>
            </div>
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="max-w-lg w-full lg:max-w-xs">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <Input
                    type="search"
                    placeholder="Search videos"
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md leading-5 bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                </div>
            </div>
            <div className="flex items-center lg:ml-6">
                {isSignedIn ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.avatar} alt="User avatar" />
                        <AvatarFallback>{currentUser?.fullname[0]}</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none select-none">{currentUser?.fullname}</p>
                        <p className="text-xs leading-none text-muted-foreground select-none">{currentUser?.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/subscriptions')}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Subscriptions</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Tv2 className="mr-2 h-4 w-4" />
                        <span>Library</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <TextSelect className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                ) : (
                <Button onClick={handleSignIn}>Sign In</Button>
                )}
            </div>
            </div>
        </div>
        </nav>
    )
}