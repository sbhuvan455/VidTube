"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, ThumbsUp, Users, Video } from "lucide-react"

interface Stats {
    _id: string,
    totalVideoViews: number,
    totalSubscribers: number,
    totalVideos: number,
    totalLikes: number,
}

interface StatCardProps {
    title: string
    value?: number
    icon: React.ReactNode
    loading: boolean
}

function Dashboard() {

    const [stats, setStats] = useState<Stats | undefined>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const fetchDetails = async() => {
            axios.get('/api/v1/dashboard/stats')
                .then((response) => {
                    console.log(response);
                    setStats(response.data.data[0]);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                })
        }

        fetchDetails();
    }, [])

    if (!stats && !loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">User is not logged in. Please log in to view the dashboard.</p>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Video Views"
                    value={stats?.totalVideoViews}
                    icon={<Eye className="h-8 w-8 text-blue-500" />}
                    loading={loading}
                />
                <StatCard
                    title="Total Subscribers"
                    value={stats?.totalSubscribers}
                    icon={<Users className="h-8 w-8 text-green-500" />}
                    loading={loading}
                />
                <StatCard
                    title="Total Videos"
                    value={stats?.totalVideos}
                    icon={<Video className="h-8 w-8 text-purple-500" />}
                    loading={loading}
                />
                <StatCard
                    title="Total Likes"
                    value={stats?.totalLikes}
                    icon={<ThumbsUp className="h-8 w-8 text-red-500" />}
                    loading={loading}
                />
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, loading }: StatCardProps) {

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-[100px]" />
                ) : (
                    <div className="text-2xl font-bold">{value?.toLocaleString()}</div>
                )}
            </CardContent>
        </Card>
    )
}


export default Dashboard
