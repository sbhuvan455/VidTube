"use client"

import { useState, ChangeEvent } from "react"
import axios from "axios"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"
import { useUserStore } from "@/store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Upload } from "lucide-react"


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullname: ""
    })

    const [avatar, setAvatar] = useState<File | null>(null)
    const [coverImage, setCoverImage] = useState<File | null>(null)

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0])
        }
    }

    const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0])
        }
    }

    const router = useRouter()
    
    const {
        signInStart,
        signInSuccess,
        signInFailure,
    } = useUserStore();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        signInStart()

        const formDataToSend = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
        })

        if (avatar) formDataToSend.append('avatar', avatar)
        if (coverImage) formDataToSend.append('coverImage', coverImage)

        axios.post('/api/v1/users/register', formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
            console.log(response);
            signInSuccess(response.data.data)
            toast({ title: "Registration successful!", description: "Welcome to our platform." })
            router.push('/');
        })
        .catch((error) => {
            console.log(error.response.data.message);
            toast({
                title: error.response.data.message
            })
            signInFailure(error.response.data)
        })
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                <CardTitle>Create new User</CardTitle>
                <CardDescription>Please fill in your details to register</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="username">Username (*)</Label>
                    <Input id="username" name="username" value={formData.username} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="email">Email (*)</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name (*)</Label>
                    <Input id="fullname" name="fullname" value={formData.fullname} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password">Password (*)</Label>
                    <div className="relative">
                        <Input 
                        id="password" 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        required 
                        />
                        <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar</Label>
                    <div className="flex items-center space-x-2">
                        <Input id="avatar" type="file" onChange={handleAvatarChange} className="hidden" />
                        <Button type="button" variant="outline" onClick={() => document.getElementById('avatar')?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Upload Avatar
                        </Button>
                        {avatar && <span className="text-sm text-muted-foreground">{avatar.name}</span>}
                    </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image</Label>
                    <div className="flex items-center space-x-2">
                        <Input id="coverImage" type="file" onChange={handleCoverImageChange} className="hidden" />
                        <Button type="button" variant="outline" onClick={() => document.getElementById('coverImage')?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Upload Cover Image
                        </Button>
                        {coverImage && <span className="text-sm text-muted-foreground">{coverImage.name}</span>}
                    </div>
                    </div>
                    <Button type="submit" className="w-full">Register</Button>
                </form>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    )
}