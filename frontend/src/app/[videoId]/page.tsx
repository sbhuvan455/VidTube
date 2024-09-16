"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, Share2, MessageSquare, Smile, MoreVerticalIcon, Pencil, Flag, Trash2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { useUserStore } from '@/store'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"


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

interface Comment {
    _id: string;
    content: string;
    video: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
    owner_details: Owner;
}

export default function VideoStreamingPage() {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [video, setVideo] = useState<Video>()
    const [comments, setComments] = useState<Comment[]>()
    const [newComment, setNewComment] = useState<string>('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editedCommentContent, setEditedCommentContent] = useState<string>('')
    const [subscribers, setSubscribers] = useState<number>(0);
    const [userHasLiked, setUserHasLiked] = useState(false);
    const [userHasDisliked, setUserHasDisliked] = useState(false);

    const { videoId } = useParams();
    const { toast } = useToast()

    const { currentUser } = useUserStore();

    const emojis = ['😀', '😍', '😂', '😮', '😢', 
                    '😠', '👍', '👎', '❤️', '🎉', 
                    '🤔', '👏', '🙌', '🔥', '🎶', 
                    '💯', '🥳', '💪', '🌟', '🥰', 
                    '😎', '🙏', '😇', '👀', '🤯', 
                    '🤗', '🤩', '😋', '😜', '😏', 
                    '🙈', '😴', '🤤', '😷', '🥺', 
                    '😅', '😱', '🤑', '🎁', '🍕', 
                    '🍔', '🍟', '🍩', '🍦', '🍎', 
                    '🍇', '🍉', '🍒', '🍓', '🍌'
                ];

    console.log(videoId);

    const handleSubscribe = async() => {
        await axios.post(`/api/v1/subscriptions/c/${video?.owner[0]._id}`)
                    .then((response) => {
                        console.log(response)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
        
        isSubscribed ? setSubscribers(subscribers - 1) : setSubscribers(subscribers + 1)
        setIsSubscribed(!isSubscribed)
    }

    const handleLike = async() => {
        await axios.post(`/api/v1/likes/toggle/v/${videoId}`, { type: 'like' })
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
        await axios.post(`/api/v1/likes/toggle/v/${videoId}`, { type: 'dislike' })
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

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!newComment.trim()) {
            toast({
                title: "Comment cannot be empty",
                description: "Please type something before submitting."
            });
            return;
        }
    
        await axios.post(`/api/v1/comments/${videoId}`, { comment: newComment })
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
                    title: "Unable to add comment to video",
                    description: "Try again after some time"
                });
            });
    }
    

    const handleCommentReport = () => {
        console.log("comment is reported")
        toast({
            title: "The comment has been reported"
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

    const addEmoji = (emoji: string) => {
        setNewComment(newComment + emoji)
    }

    useEffect(() => {
        
        const fetchDetails = async () => {
            await axios.get(`/api/v1/videos/${videoId}`)
                        .then((response) => {
                            console.log(response.data.data[0]);
                            setVideo(response.data.data[0]);  
                        })
                        .catch((error) => {
                            console.log(error.message);
                        })

            await axios.get(`/api/v1/likes/videos/${videoId}`)
                        .then((response) => {
                            console.log(response.data.data);
                            setLikes(response.data.data.numberOfLikes);
                            setDislikes(response.data.data.numberOfDislikes);
                        })
                        .catch((error) => {
                            console.log(error);
                        })

            await axios.get(`/api/v1/comments/${videoId}`)
                        .then((response) => {
                            console.log(response);
                            setComments(response.data.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
        }

        fetchDetails();

    }, [videoId])

    useEffect(() => {
        const getSubscription = async () => {
            await axios.get(`/api/v1/subscriptions/u/s/${video?.owner[0]._id}`)
                        .then((response) => {
                            console.log(response.data.data);
                            setIsSubscribed(response.data.data.isSubscribed)
                        })
                        .catch((error) => {
                            console.log(error);
                        })
        }

        const getNumberOfSubscribers = async () => {
            await axios.get(`/api/v1/subscriptions/u/${video?.owner[0]._id}`)
                        .then((response) => {
                            console.log(response.data.data.length)
                            setSubscribers(response.data.data.length);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
        }

        getSubscription();
        getNumberOfSubscribers();
    }, [video])

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="aspect-w-16 aspect-h-9 mb-4">
            <video 
                src={video?.videoFile} 
                className="w-full h-full object-cover rounded-lg" 
                controls
                poster={video?.Thumbnail}
            >
            </video>
        </div>

        <h1 className="text-2xl font-bold mb-2">{video?.title}</h1>

        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={video?.owner[0].avatar} alt="Channel Avatar" />
                    <AvatarFallback>{video?.owner[0].fullname[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-semibold">{video?.owner[0].fullname}</h2>
                    <p className="text-sm text-muted-foreground">{subscribers} subscribers</p>
                </div>
            </div>
            <Button 
                variant={isSubscribed ? "secondary" : "default"}
                onClick={handleSubscribe}
            >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
        </div>

        <div className="flex space-x-4 mb-6">
            <Button variant="outline" onClick={handleLike}>
            <ThumbsUp className="mr-2 h-4 w-4" />
            {likes.toLocaleString()}
            </Button>
            <Button variant="outline" onClick={handleDislike}>
            <ThumbsDown className="mr-2 h-4 w-4" />
            {dislikes.toLocaleString()}
            </Button>
        </div>

        <div className="bg-muted p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm">
            {video?.description}
            </p>
        </div>

        <div className="mb-6">
        <h3 className="font-semibold mb-4">Add a comment</h3>
            <form onSubmit={handleCommentSubmit} className="flex flex-col space-y-2">
            <div className="flex space-x-2">
                <Input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow"
                />
                <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                    <Smile className="h-4 w-4" />
                    <span className="sr-only">Add emoji</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                    <div className="grid grid-cols-6 gap-2">
                    {emojis.map((emoji) => (
                        <Button
                        key={emoji}
                        variant="ghost"
                        className="text-lg"
                        onClick={() => addEmoji(emoji)}
                        >
                        {emoji}
                        </Button>
                    ))}
                    </div>
                </PopoverContent>
                </Popover>
            </div>
            <Button type="submit" className="self-end">Post</Button>
            </form>
        </div>

        <div>
            <h3 className="font-semibold mb-4">Comments</h3>
            {comments?.map((comment, index) => (
                <div key={index} className='flex items-center justify-between'>
                    <div className="flex space-x-4 mb-4">
                        <Avatar>
                            <AvatarImage src={comment.owner_details.avatar} alt={`User ${index + 1}`} />
                            <AvatarFallback>{comment.owner_details.fullname[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-semibold">{comment.owner_details.fullname}</p>
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
                            {(currentUser._id === comment.owner_details._id) && 
                                <DropdownMenuItem onSelect={() => handleCommentEdit(comment)}>
                                    <Pencil className='mr-2 h-4 w-4'/>
                                    Edit
                                </DropdownMenuItem>
                            }
                            {(currentUser._id === comment.owner_details._id) && 
                                <DropdownMenuItem onSelect={() => handleCommentDelete(comment)}>
                                    <Trash2 className='mr-2 h-4 w-4'/>
                                    Delete
                                </DropdownMenuItem>
                            }
                            {(currentUser._id != comment.owner_details._id) && 
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
        <Toaster />
        </div>
    )
}