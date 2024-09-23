'use client'

import { useUserStore } from "@/store"
import Link from "next/link"
import { LayoutDashboard, Video, FileText, List, AlignLeft } from "lucide-react"
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { currentUser } = useUserStore()
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

    const sidebarRef = useRef<HTMLDivElement>(null)

    const sidebarItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/d/dashboard" },
        { name: "Videos", icon: Video, href: "/d/videos" },
        { name: "Posts", icon: FileText, href: "/d/posts" },
        { name: "Playlists", icon: List, href: "/d/playlists" },
    ]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsSidebarOpen(false)
            }
        }


        document.addEventListener("mousedown", handleClickOutside)
        

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    return (
        <div className="flex h-screen bg-gray-100">
            <div ref={sidebarRef} className={`bg-white shadow-md fixed h-full z-10 transition-all duration-300 md:w-64 md:block ${isSidebarOpen ? 'w-64' : 'hidden'}`}>
                <div className="p-4 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                        <img
                            src={currentUser?.avatar || "/placeholder.svg"}
                            alt={currentUser?.fullname}
                            className="object-fill"
                        />
                    </div>
                    <h2 className="text-xl font-semibold">{currentUser?.fullname}</h2>
                    <p className="text-gray-600">@{currentUser?.username}</p>
                </div>
                <nav className="mt-8">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${
                                pathname === item.href ? 'bg-gray-200 font-semibold' : ''
                            }`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex flex-col flex-1">
                <header className="bg-white shadow-md p-4 flex justify-between items-center lg:hidden">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        <AlignLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </header>
                <main className="flex-1 p-8 overflow-auto lg:ml-64">
                    {children}
                </main>
            </div>
        </div>
    )
}