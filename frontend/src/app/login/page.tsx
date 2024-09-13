"use client"

import { useState } from "react"
import { Eye, EyeOff, LogIn, User, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import axios from "axios"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"
import { useUserStore } from "@/store"
import { useRouter } from "next/navigation"


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    })

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

        axios.post('/api/v1/users/login', formData)
            .then((response) => {
                console.log(response);
                signInSuccess(response.data.data)
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
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center">Welcome to VidTube</CardTitle>
                        <CardDescription className="text-center text-lg">
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold">New to VidTube?</h3>
                            <p className="text-muted-foreground">
                                Join our community of content creators and viewers today!
                            </p>
                            <Button variant="outline" className="w-full">
                                Create an Account
                            </Button>
                        </div>
                    </div>
                    <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Tabs defaultValue="username" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="username">Username</TabsTrigger>
                            <TabsTrigger value="email">Email</TabsTrigger>
                        </TabsList>
                        <TabsContent value="username" className="space-y-4">
                            <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="Enter your username"
                                        className="pl-10"
                                        required
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="email" className="space-y-4">
                            <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                        </Tabs>
                        <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-10"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                            </span>
                            </Button>
                        </div>
                        </div>
                        <Button type="submit" className="w-full">
                        <LogIn className="mr-2 h-4 w-4" /> Sign In
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <a href="#" className="text-sm text-primary hover:underline">
                        Forgot your password?
                        </a>
                    </div>
                    </div>
                </div>
                </CardContent>
                <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    By signing in, you agree to our{" "}
                    <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                    </Link>
                    .
                </p>
                </CardFooter>
            </Card>
            <Toaster />
        </div>
    )
}