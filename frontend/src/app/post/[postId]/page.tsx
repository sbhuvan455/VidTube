"use client"

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, MoreVertical, Smile, MoreVerticalIcon, Pencil, Flag, Trash2 } from "lucide-react"
import EmojiPicker from 'emoji-picker-react'
import axios from 'axios';
import { useUserStore } from '@/store'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"


interface Owner {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    avatar: string;
    coverImage: string;
    SubscribersCount: number;
    ChannelsSubscribedTo: number;
    isSubscribed: boolean;
}


interface Post {
    _id: string;
    owner: string;
    content: string;
    ownerDetails: Owner;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Comment{
    _id: string;
    owner: string;
    content: string;
    ownerDetails: Owner;
    tweet: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

function PostPage() {

    const [post, setPost] = useState<Post | undefined>()
    const [comments, setComments] = useState<Comment[] | undefined>()
    const [likes, setLikes] = useState<number>(0)
    const [dislikes, setDislikes] = useState<number>(0)
    const [newComment, setNewComment] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editedCommentContent, setEditedCommentContent] = useState<string>('')
    const [userHasLiked, setUserHasLiked] = useState(false);
    const [userHasDisliked, setUserHasDisliked] = useState(false);

    const { postId } = useParams();

    const { currentUser } = useUserStore();
    const { toast } = useToast();

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast({
                title: "Comment cannot be empty",
                description: "Please type something before submitting."
            });
            return;
        }

        await axios.post(`/api/v1/comments/t/${postId}`, { comment: newComment })
            .then((response) => {
                console.log(response.data.data);
                setComments([
                    ...comments!,
                    response.data.data,
                ]);
                setNewComment('');
            })
            .catch((error) => {
                console.log(error);
                toast({
                    title: "Unable to add comment to tweet",
                    description: "Try again after some time"
                });
            });
    }

    const handleEmojiClick = (emojiObject: any) => {
        setNewComment(prevComment => prevComment + emojiObject.emoji)
    }

    const handleCommentReport = () => {
        console.log("comment is reported")
        toast({
            title: "The comment has been reported"
        })
    }

    const handlePostReport = () => {
        toast({
            title: "The Post has been reported"
        })
    }

    const handleLike = async() => {
        await axios.post(`/api/v1/likes/toggle/t/${postId}`, { type: 'like' })
                    .then((response) => {
                        console.log(response)

                        if (userHasDisliked) {
                            setDislikes(dislikes - 1);
                            setUserHasDisliked(false);
                        }

                        if (userHasLiked) {
                            setLikes(likes - 1);
                            setUserHasLiked(false);
                        } else {
                            setLikes(likes + 1);
                            setUserHasLiked(true);
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
    }
    
    const handleDislike = async() => {
        await axios.post(`/api/v1/likes/toggle/t/${postId}`, { type: 'dislike' })
                    .then((response) => {
                        console.log(response)

                        if (userHasLiked) {
                            setLikes(likes - 1);
                            setUserHasLiked(false);
                        }
                    
                        if (userHasDisliked) {
                            setDislikes(dislikes - 1);
                            setUserHasDisliked(false);
                        } else {
                            setDislikes(dislikes + 1);
                            setUserHasDisliked(true);
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
    }

    const handleCommentDelete = (comment: Comment) => {
        console.log("Delete comment")
        const commentId = comment._id

        axios.delete(`/api/v1/comments/c/${commentId}`)
                .then((response) => {
                    console.log(response.data.data);
                    setComments(comments?.filter((comment) => comment._id !== commentId));
                })
                .catch((error) => {
                    console.log(error);
                    toast({
                        title: "Unable the delete comment",
                        description: "Try again after some time",
                    })
                })
    }
    
    const handleCommentEdit = (comment: Comment) => {
        setEditingCommentId(comment._id)
        setEditedCommentContent(comment.content)
    }

    const handleCancelEdit = () => {
        setEditingCommentId(null)
        setEditedCommentContent('')
    }

    const handleCommentUpdateSubmit = async (commentId: string) => {
        await axios.patch(`/api/v1/comments/c/${commentId}`, { comment: editedCommentContent })
                    .then((response) => {
                        console.log(response)
                        setComments(comments?.map((comment) =>
                            comment._id === commentId ? { ...comment, content: editedCommentContent } : comment
                        ))
                        setEditingCommentId(null)
                        setEditedCommentContent('')
                    })
                    .catch((error) => {
                        console.log(error)
                        toast({
                            title: "Some error occurred while editing comment",
                            description: "Try again after a few seconds"
                        })
                        setEditingCommentId(null)
                        setEditedCommentContent('')
                    })
    }

    useEffect(() => {
        const fetchDetails = async () => {
            await axios.get(`/api/v1/tweets/${postId}`)
                        .then((response) => {
                            console.log(response.data.data);
                            setPost(response.data.data[0]);
                        })
                        .catch((error) => {
                            console.log(error);
                        })

            await axios.get(`/api/v1/comments/t/${postId}`)
                        .then((response) => {
                            console.log(response.data.data);
                            setComments(response.data.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        })

            await axios.get(`/api/v1/likes/tweets/${postId}`)
                        .then((response) => {
                            console.log(response.data.data);
                            setLikes(response.data.data.numberOfLikes);
                            setDislikes(response.data.data.numberOfDislikes);
                        })
                        .catch((error) => console.log(error));
        }

        fetchDetails();
    }, [postId])

    if (!post) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="rounded-lg p-4 mb-6 border-gray-100/85 border-2">
                <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                    <AvatarImage src={post.ownerDetails.avatar} alt={post.ownerDetails.fullname} />
                    <AvatarFallback>{post.ownerDetails.fullname.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <h2 className="font-bold">{post.ownerDetails.fullname}</h2>
                    <p className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVerticalIcon className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={handlePostReport}>
                                <Flag className='mr-2 h-4 w-4' />
                                Report
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <p className="text-lg mb-4">{post.content}</p>
                <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                    <Button variant="ghost" className="flex items-center space-x-2" onClick={handleLike}>
                    <ThumbsUp className="w-5 h-5" />
                    <span>{likes}</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center space-x-2" onClick={handleDislike}>
                    <ThumbsDown className="w-5 h-5" />
                    <span>{dislikes}</span>
                    </Button>
                </div>
                <Button variant="ghost">
                    <Share2 className="w-5 h-5" />
                </Button>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">{comments?.length || 0} Comments</h3>
                <div className="flex items-center space-x-2 mb-4">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={post.ownerDetails.avatar} alt={post.ownerDetails.fullname} />
                    <AvatarFallback>{post.ownerDetails.fullname[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                    <Input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full "
                    />
                    <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <Smile className='w-4 h-4'/>
                    </Button>
                </div>
                <Button onClick={handleAddComment}>Comment</Button>
                </div>
                {showEmojiPicker && (
                <div className="absolute z-10">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
                )}
            </div>

            {comments && comments.length > 0 ? (
                <div className="space-y-4">
                {comments?.map((comment, index) => (
                <div key={index} className='flex items-center justify-between'>
                    <div className="flex space-x-4 mb-4">
                        <Avatar>
                            <AvatarImage src={comment.ownerDetails.avatar} alt={`User ${index + 1}`} />
                            <AvatarFallback>{comment.ownerDetails.fullname[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-medium">{comment.ownerDetails.fullname}  
                            <span className='font-thin text-sm mx-4'>
                            {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </p>
                        {editingCommentId === comment._id ? (
                                <div>
                                    <Input
                                        value={editedCommentContent}
                                        onChange={(e) => setEditedCommentContent(e.target.value)}
                                        className='w-[90vw]'
                                    />
                                    <div className="flex space-x-2 mt-2">
                                        <Button onClick={() => handleCommentUpdateSubmit(comment._id)}>Save</Button>
                                        <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">{comment.content}</p>
                        )}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            {(currentUser._id === comment.ownerDetails._id) && 
                                <DropdownMenuItem onSelect={() => handleCommentEdit(comment)}>
                                    <Pencil className='mr-2 h-4 w-4'/>
                                    Edit
                                </DropdownMenuItem>
                            }
                            {(currentUser._id === comment.ownerDetails._id) && 
                                <DropdownMenuItem onSelect={() => handleCommentDelete(comment)}>
                                    <Trash2 className='mr-2 h-4 w-4'/>
                                    Delete
                                </DropdownMenuItem>
                            }
                            {(currentUser._id != comment.ownerDetails._id) && 
                            <DropdownMenuItem onSelect={handleCommentReport}>
                                <Flag className='mr-2 h-4 w-4' />
                                Report
                            </DropdownMenuItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}
            </div>
        ) : (
            <p>No comments yet.</p>
        )}
        <Toaster />
        </div>
    )
}

export default PostPage
