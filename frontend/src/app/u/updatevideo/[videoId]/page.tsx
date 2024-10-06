'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Toaster } from '@/components/ui/toaster'

interface Owner {
    _id: string;
    username: string;
    email: string;
    password: string;
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

export default function UpdateVideo() {
    const [videoDetails, setVideoDetails] = useState<Video>({
        _id: '',
        videoFile: '',
        Thumbnail: '',
        title: '',
        description: '',
        duration: 0,
        views: 0,
        isPublished: false,
        owner: [],
        createdAt: '',
        updatedAt: '',
        __v: 0,
        avatar: ''
    })
    const [isPublished, setIsPublished] = useState(false)
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { videoId } = useParams()

    useEffect(() => {
        const fetchDetails = () => {
            axios.get(`/api/v1/videos/${videoId}`)
                .then((response) => {
                    setVideoDetails(response.data.data[0])
                    setIsPublished(response.data.data[0].isPublished)
                })
                .catch((error) => {
                    console.error('Error fetching video details:', error)
                    toast({
                        title: "Error",
                        description: "Failed to fetch video details. Please try again.",
                        variant: "destructive",
                    })
                })
        }

        fetchDetails()
    }, [videoId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setVideoDetails(prev => ({
            ...prev, 
            [e.target.name]: e.target.value 
        }))
    }

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0])
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData()

        formData.append('title', videoDetails.title)
        formData.append('description', videoDetails.description)

        if (thumbnail) {
            formData.append('thumbnail', thumbnail)
        }

        axios.patch(`/api/v1/videos/update/${videoId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(() => {
            toast({
                title: "Success",
                description: "Video updated successfully!",
            })
            
        })
        .catch((error) => {
            console.error('Error updating video:', error)
            toast({
                title: "Error",
                description: "Failed to update video. Please try again.",
                variant: "destructive",
            })
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    const handlePublishToggle = async () => {
        await axios.patch(`/api/v1/videos/togglepublishstatus/${videoId}`)
                    .then((response) => {
                        console.log(response.data.data);
                        setIsPublished(!isPublished);
                    })
                    .catch((error) => {
                        console.log(error.message);
                    })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Update Video</h1>
            <div className="mb-6">
                <video 
                    src={videoDetails.videoFile} 
                    controls 
                    className="w-full max-w-2xl mx-auto"
                    poster={videoDetails.Thumbnail}
                >
                    Your browser does not support the video tag.
                </video>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={videoDetails.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={videoDetails.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="thumbnail">Thumbnail</Label>
                    <Input
                        id="thumbnail"
                        type="file"
                        onChange={handleThumbnailChange}
                        accept="image/*"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="isPublished"
                        checked={isPublished}
                        onCheckedChange={() => handlePublishToggle()}
                    />
                    <Label htmlFor="isPublished">Publish video</Label>
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Video'}
                </Button>
            </form>
            <Toaster />
        </div>
    )
}