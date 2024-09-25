"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Edit, Eye, Clock } from 'lucide-react'

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

export default function Videos() {
    const [videos, setVideos] = useState<Video[] | undefined>();

    useEffect(() => {
        const fetchDetails = async () => {
            await axios.get(`/api/v1/dashboard/videos`)
                .then((response) => {
                    console.log(response.data.data);
                    setVideos(response.data.data);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        fetchDetails();
    }, [])

    const handlePublishToggle = async(videoId: string, status: boolean) => {
        await axios.patch(`/api/v1/videos/togglepublishstatus/${videoId}`)
                    .then((response) => {
                        console.log(response.data.data);
                        setVideos((prevVideos) =>
                            prevVideos?.map((video) =>
                                video._id === videoId ? { ...video, isPublished: !status } : video
                            )
                        );
                    })
                    .catch((error) => {
                        console.log(error.message);
                    })
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

    if (!videos || videos.length <= 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl mb-4">You have no videos to show!</p>
                <Link href="/c/uploadvideo">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Upload New Video
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="md:text-3xl text-2xl md:font-bold">Your Videos</h1>
                <Link href="/n/uploadvideo">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Upload New Video
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <Card key={video._id} className="overflow-hidden">
                        <CardHeader className="p-0">
                            <img 
                                src={video.Thumbnail} 
                                alt={video.title} 
                                className="w-full h-48 object-cover"
                            />
                        </CardHeader>
                        <CardContent className="p-4">
                            <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
                            <CardDescription className="text-sm line-clamp-2 mb-2">
                                {video.description}
                            </CardDescription>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span className="flex items-center">
                                    <Eye className="mr-1 h-4 w-4" /> {video.views}
                                </span>
                                <span className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4" /> {formatDuration(video.duration)}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                            <div className="flex items-center space-x-2">
                                <Switch 
                                    checked={video.isPublished}
                                    onCheckedChange={() => handlePublishToggle(video._id, video.isPublished)}
                                />
                                <span className="text-sm">{video.isPublished ? 'Published' : 'Unpublished'}</span>
                            </div>
                            <Link href={`/u/updatevideo/${video._id}`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}