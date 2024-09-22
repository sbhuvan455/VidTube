"use client"

import { useUserStore } from "@/store"
import Link from "next/link"
import { LayoutDashboard, Video, FileText, List } from "lucide-react"
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { currentUser } = useUserStore()

    const sidebarItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/d/dashboard" },
        { name: "Videos", icon: Video, href: "/d/videos" },
        { name: "Posts", icon: FileText, href: "/d/posts" },
        { name: "Playlists", icon: List, href: "/d/playlists" },
    ]

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md fixed h-full">
                <div className="p-4 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                        <img
                            src={currentUser.avatar || "/placeholder.svg"}
                            alt={currentUser.fullname}
                            className="object-fill"
                        />
                    </div>
                    <h2 className="text-xl font-semibold">{currentUser.fullname}</h2>
                    <p className="text-gray-600">@{currentUser.username}</p>
                </div>
                <nav className="mt-8">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${
                                pathname === item.href ? 'bg-gray-200 font-semibold' : ''
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-auto ml-64">
                {children}
            </main>
        </div>
    )
}
