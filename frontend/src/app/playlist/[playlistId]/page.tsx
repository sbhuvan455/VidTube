"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { PlayCircle, Clock, Eye } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios';
import Link from 'next/link'

interface Video {
    _id: string;
    videoFile: string;
    Thumbnail: string;
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
    owner: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    avatar: string;
}

interface Playlist {
    _id: string;
    name: string;
    description: string;
    videos: Video[];
    owner: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    thumbnail: string;
}

function Playlist() {

    const [playlist, setPlaylist] = useState<Playlist | undefined>()

    const { playlistId } = useParams();
    

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/api/v1/playlists/${playlistId}`)
                        .then((responses) => {
                            console.log(responses.data.data);
                            setPlaylist(responses.data.data[0])
                        })
                        .catch((error) => {
                            console.log(error);
                        })
        }

        fetchData();
    }, [playlistId]);

    if (!playlist) return <PlaylistSkeleton />

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <img
                            src={playlist.thumbnail}
                            alt={playlist.name}
                            width={320}
                            height={180}
                            className="rounded-lg object-cover w-full md:w-80"
                        />
                        <div className="flex-grow">
                            <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
                            <p className="mb-4">{playlist.description}</p>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <span className="flex items-center mr-4">
                                    <PlayCircle className="w-4 h-4 mr-1" />
                                    {playlist.videos.length} videos
                                </span>
                                <span className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    {playlist.videos.reduce((acc, video) => acc + video.views, 0).toLocaleString()} views
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {playlist.videos.map((video, index) => (
                    <Link key={video._id} href={`/${video._id}`} className='my-4'>
                    <Card className="hover:bg-gray-750 transition duration-200 cursor-pointer my-4">
                        <CardContent className="p-4 my-4">
                            <div className="flex items-start gap-4">
                                <div className="text-sm w-8 text-center">{index + 1}</div>
                                <div className="relative">
                                    <img
                                        src={video.Thumbnail}
                                        alt={video.title}
                                        width={160}
                                        height={90}
                                        className="rounded object-cover"
                                    />
                                    <div className="absolute bottom-1 right-1 text-xs px-1 py-0.5 rounded bg-gray-600/40 text-white">
                                        {formatDuration(video.duration)}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h2 className="text-lg font-semibold mb-1 line-clamp-2">{video.title}</h2>
                                    <p className="text-sm mb-1 line-clamp-1">{video.description}</p>
                                    <div className="flex items-center text-xs ">
                                        <span className="flex items-center mr-3">
                                            <Eye className="w-3 h-3 mr-1" />
                                            {video.views.toLocaleString()} views
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(video.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

function PlaylistSkeleton() {
    return (
        <div className="container mx-auto p-4 min-h-screen">
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <Skeleton className="w-full md:w-80 h-45 rounded-lg" />
                        <div className="flex-grow w-full">
                            <Skeleton className="h-8 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {[1, 2, 3].map((_, index) => (
                <Card key={index} className="mb-4">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <Skeleton className="w-40 h-24 rounded" />
                            <div className="flex-grow">
                                <Skeleton className="h-5 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
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

export default Playlist
