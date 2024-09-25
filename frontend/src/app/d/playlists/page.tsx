"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'
import { Trash, Plus, X } from 'lucide-react'


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
    thumbnail: string;
    name: string;
    description: string;
    owner: string;
    videos: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}


function Playlist() {

    const [playlists, setPlaylists] = useState<Playlist[] | undefined>()
    const [videos, setVideos] = useState<Video[] | undefined>()

    useEffect(() => {
        const fetchDetails = async () => {
            await axios.get("/api/v1/dashboard/playlists")
                        .then((response) => {
                            console.log(response.data.data);
                            setPlaylists(response.data.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        })

            await axios.get("/api/v1/dashboard/videos")
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

    const handleDeletePlaylist = async (playlistId: string) => {
        await axios.delete(`/api/v1/playlists/${playlistId}`)
                    .then((response) => {
                        console.log(response.data.data);
                        setPlaylists(playlists?.filter(playlist => playlist._id !== playlistId))
                    })
                    .catch((error) => {
                        console.error("Error deleting playlist:", error)
                    })
    }
        
    const handleAddVideoToPlaylist = async (playlistId: string, videoId: string) => {
        await axios.patch(`/api/v1/playlists/add/${videoId}/${playlistId}`)
                    .then((response) => {
                        console.log(response);
                        setPlaylists((prevPlaylists) => 
                            prevPlaylists?.map((prevPlaylist) => 
                                prevPlaylist._id === playlistId ? {
                                    ...prevPlaylist,
                                    videos: [...prevPlaylist.videos, videoId]
                                } : prevPlaylist
                            )
                        )
                    })
                    .catch((error) => {
                        console.log(error);
                    })
    }
        
    const handleRemoveVideoFromPlaylist = async (playlistId: string, videoId: string) => {
        await axios.patch(`/api/v1/playlists/remove/${videoId}/${playlistId}`)
                    .then((response) => {
                        console.log(response.data.data);
                        setPlaylists((prevPlaylists) => 
                            prevPlaylists?.map((playlist) => 
                                playlist._id === playlistId ? { 
                                    ...playlist,
                                    videos: playlist.videos?.filter((video) => video !== videoId)
                                } : playlist
                            )
                        )
                    })
                    .catch((error) => {
                        console.log(error)
                    })
    }

    return (
        <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Playlists</h1>
            <Link href="/n/createplaylist">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Create New Playlist
            </Button>
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists?.map((playlist) => (
            <Card key={playlist._id}>
                <CardHeader>
                <img
                    src={playlist.thumbnail}
                    alt={playlist.name}
                    width={300}
                    height={169}
                    className="w-full h-auto object-cover rounded-t-lg"
                />
                <CardTitle className="flex justify-between items-center mt-2">
                    {playlist.name}
                    <Button variant="destructive" size="icon" onClick={() => handleDeletePlaylist(playlist._id)}>
                    <Trash className="h-4 w-4" />
                    </Button>
                </CardTitle>
                </CardHeader>
                <CardContent>
                <h3 className="font-semibold mb-2">Videos in playlist:</h3>
                <ScrollArea className="h-40 mb-4">
                    {playlist.videos.map((videoId) => {
                    const video = videos?.find(v => v._id === videoId)
                    return video ? (
                        <div key={video._id} className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                            <img
                            src={video.Thumbnail}
                            alt={video.title}
                            width={50}
                            height={28}
                            className="mr-2 rounded"
                            />
                            <span className="text-sm">{video.title}</span>
                        </div>
                        <Button
                            variant="outline" 
                            size="icon"
                            onClick={() => handleRemoveVideoFromPlaylist(playlist._id, video._id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        </div>
                    ) : null
                    })}
                </ScrollArea>
                <Dialog>
                    <DialogTrigger asChild>
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> Add Videos
                    </Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Videos to {playlist.name}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[400px] mt-4">
                        {videos?.map((video) => (
                        <div key={video._id} className="flex items-center space-x-2 mb-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddVideoToPlaylist(playlist._id, video._id)}
                                disabled={playlist.videos.includes(video._id)}
                            >
                            {playlist.videos.includes(video._id) ? 'Added' : 'Add'}
                            </Button>
                            <img
                                src={video.Thumbnail}
                                alt={video.title}
                                width={50}
                                height={28}
                                className="mr-2 rounded"
                            />
                            <span className="text-sm">{video.title}</span>
                        </div>
                        ))}
                    </ScrollArea>
                    </DialogContent>
                </Dialog>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    )
}

export default Playlist
