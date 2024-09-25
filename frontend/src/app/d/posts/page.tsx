'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import EmojiPicker from 'emoji-picker-react'
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, Edit, Trash, Smile } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

interface Post {
    _id: string;
    content: string;
    totalLikes: number;
    totalDislikes: number;
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState('');
    const [editingPost, setEditingPost] = useState<string | null>(null);
    const [editContent, setEditContent] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    const { toast } = useToast();

    useEffect(() => {
        const fetchDetails = async () => {
            await axios.get('/api/v1/dashboard/tweets')
                        .then((response) => {
                            console.log(response.data.data)
                            setPosts(response.data.data);
                        })
                        .catch((error) => {
                            console.log(error)
                        })
        }

        fetchDetails()
    }, [])

    const handleCreatePost = async () => {

        if(!newPost.trim()) {
            toast({
                title: "Unable to create a new post",
                description: "Enter the message in the post area to create a new post.",
            })
        }


        await axios.post(`/api/v1/tweets`, { content: newPost })
                    .then((response) => {
                        console.log(response);
                        setPosts((prevPosts) => [response.data.data, ...prevPosts]);
                        setNewPost('');
                    })
                    .catch((error) => {
                        console.log(error);
                        toast({
                            title: "Unable to create a new post",
                            description: "We are currently expiriencing issues in creating the post, please try again after sometime.",
                        })
                    })
    }

    const handleEditPost = async (id: string) => {
        await axios.patch(`/api/v1/tweets/${id}`, { content: editContent })
                    .then((response) => {
                        console.log(response.data.data);
                        setPosts(posts.map((post) => 
                            post._id === id ? { ...post, content: editContent } : post
                        ))

                        setEditingPost(null);
                    })
                    .catch((error) => {
                        setEditingPost(null);
                        console.log(error);
                        toast({
                            title: "Unable to edit the post",
                            description: "We are currently expiriencing issues in updating the post, please try again after sometime.",
                        })
                    })
    }

    const handleDeletePost = async (id: string) => {
        await axios.delete(`/api/v1/tweets/${id}`)
                    .then((response) => {
                        console.log(response.data.data);
                        setPosts(posts.filter(post => post._id !== id));
                    })
                    .catch((error) => {
                        console.log(error.message);
                        toast({
                            title: "Unable to delete the post",
                            description: "We are currently expiriencing issues in deleting the post, please try again after sometime.",
                        })
                    })
    }

    const handleEmojiClick = (emojiObject: any) => {
        setNewPost(prevPost => prevPost + emojiObject.emoji)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Posts</h1>
            
            <Card className="mb-6 relative">
                <CardHeader>
                    <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="What's on your mind?"
                        className='relative'
                    />
                    <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-5 top-[45%] transform -translate-y-1/2"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <Smile className='w-4 h-4'/>
                    </Button>
                    {showEmojiPicker && (
                    <div className="absolute z-10">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCreatePost}>Post</Button>
                </CardFooter>
            </Card>

            {posts.map((post) => (
                <Card key={post._id} className="mb-4">
                    <CardContent className="pt-4">
                        {editingPost === post._id ? (
                            <Input
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                        ) : (
                            <p>{post.content}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                {post.totalLikes}
                            </Button>
                            <Button variant="ghost" size="sm">
                                <ThumbsDown className="mr-1 h-4 w-4" />
                                {post.totalDislikes}
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            {editingPost === post._id ? (
                                <Button onClick={() => handleEditPost(post._id)}>Save</Button>
                            ) : (
                                <Button variant="ghost" size="sm" onClick={() => {
                                    setEditingPost(post._id);
                                    setEditContent(post.content);
                                }}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post._id)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
            <Toaster />
        </div>
    )
}