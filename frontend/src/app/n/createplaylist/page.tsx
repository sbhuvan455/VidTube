"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import axios from 'axios'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreatePlaylist() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
            setThumbnail(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsSubmitting(true)
        setError('')
        setSuccess(false)

        const formData = new FormData()

        formData.append('name', name)
        formData.append('description', description)

        if (thumbnail) formData.append('thumbnail', thumbnail)

        await axios.post(`/api/v1/playlists`, formData, {
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
        <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create New Playlist</CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Enter playlist name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Enter playlist description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
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
                    {isSubmitting ? 'Creating Playlist...' : 'Create Playlist'}
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    )
}