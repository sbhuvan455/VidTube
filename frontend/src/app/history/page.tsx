"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from 'date-fns'


interface Owner {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    avatar: string;
    coverImage: string;
    watchHistory: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    refreshTokens: string;
}

interface Video {
    _id: string;
    videoFile: string;
    Thumbnail: string;
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
    owner: Owner[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    avatar: string;
}

function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    const seconds = Math.floor((minutes * 60) % 60);

    if (hours > 0) {
        return `${hours}:${remainingMinutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
        return `${remainingMinutes}:${seconds.toString().padStart(2, "0")}`;
    }
}

function History() {

    const [videos, setVideos] = useState<Video[] | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {

        const fetchDetails = async () => {
            await axios.get('/api/v1/users/history')
                        .then((response) => {
                            console.log(response.data.data);
                            setVideos(response.data.data);
                        })
                        .catch((error) => {
                            console.log(error.message);
                        })
                        .finally(() => {
                            setIsLoading(false);
                        })
        }

        fetchDetails()

    }, [])

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Watch History</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <Skeleton className="w-full h-40 rounded-lg mb-4" />
                                <Skeleton className="w-3/4 h-4 mb-2" />
                                <Skeleton className="w-1/2 h-4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Watch History</h1>
            {videos?.length === 0 ? (
                <p className="text-center text-gray-500">No videos in your watch history.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos?.map((video) => (
                        <Link href={`/${video._id}`} key={video._id}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-4">
                                    <div className="relative">
                                        <img
                                            src={video.Thumbnail}
                                            alt={video.title}
                                            width={320}
                                            height={180}
                                            className="rounded-lg object-cover w-full"
                                        />
                                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                            {formatDuration(video.duration)}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-semibold mt-2 line-clamp-2">{video.title}</h2>
                                    <div className="flex items-center mt-2">
                                        <img
                                            src={video.owner[0].avatar}
                                            alt={video.owner[0].fullname}
                                            width={24}
                                            height={24}
                                            className="rounded-full mr-2"
                                        />
                                        <span className="text-sm text-gray-600">{video.owner[0]?.fullname}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                                        <span>{video.views} views</span>
                                        <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default History
