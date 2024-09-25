"use client"

import { useState, ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function VideoPublisher() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0])
        }
    }

    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0])
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setIsSubmitting(true)
        setError('')
        setSuccess(false)

        const formData = new FormData()

        formData.append('title', title)
        formData.append('description', description)

        if (videoFile) formData.append('videoFile', videoFile)
        if (thumbnail) formData.append('thumbnail', thumbnail)

        await axios.post(`/api/v1/videos/publish-video`, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
        .then((response) => {
            console.log(response.data.data);
            setSuccess(true)
        })
        .catch((error) => {
            setError(`An error occurred while publishing the video. Please try again, ${error.message}`)
        }).finally(() => {
            setIsSubmitting(false)
        })
    }

    return (
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                <h1 className="text-3xl font-bold text-center">Publish New Video</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter video title"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Enter video description"
                        rows={4}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="videoFile">Video File</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                        id="videoFile"
                        type="file"
                        onChange={handleVideoChange}
                        required
                        accept="video/*"
                        className="hidden"
                        />
                        <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('videoFile')?.click()}
                        >
                        <Upload className="w-4 h-4 mr-2" />
                        {videoFile ? 'Change Video' : 'Upload Video'}
                        </Button>
                        {videoFile && <span className="text-sm text-muted-foreground">{videoFile.name}</span>}
                    </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                        id="thumbnail"
                        type="file"
                        onChange={handleThumbnailChange}
                        required
                        accept="image/*"
                        className="hidden"
                        />
                        <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('thumbnail')?.click()}
                        >
                        <Upload className="w-4 h-4 mr-2" />
                        {thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                        </Button>
                        {thumbnail && <span className="text-sm text-muted-foreground">{thumbnail.name}</span>}
                    </div>
                    </div>
                    {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    )}
                    {success && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Your video has been published successfully!</AlertDescription>
                    </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Publishing...' : 'Publish Video'}
                    </Button>
                </form>
            </div>
        )
    }