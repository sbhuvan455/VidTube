"use client"

import axios from "axios";
import { useParams } from "next/navigation"
import Image from 'next/image'
import { useEffect, useState } from "react";
import { PlayIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { useRouter } from "next/navigation";

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

interface Videos {
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
    avatar?: string;
}

interface Playlist {
    _id: string;
    name: string;
    description: string;
    videos: string[];
    owner: string;
    createdAt: string;
    updatedAt: string;
    thumbnail: string;
    __v: number;
}

interface Post {
    _id: string;
    owner: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}  

export default function ChannelHomePage(){
    const [owner, setOwner] = useState<Owner | undefined>();
    const [videos, setVideos] = useState<Videos[] | undefined>();
    const [playlists, setPlaylists] = useState<Playlist[] | undefined>();
    const [posts, setPosts] = useState<Post[] | undefined>();
    const [activeTab, setActiveTab] = useState<string>('videos')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { username } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchDetails = async () => {
            await axios.get(`/api/v1/users/c/${username}`)
                        .then((response) => {
                            console.log(response.data.data);
                            setOwner(response.data.data);
                            setIsLoading(false);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
        }

        fetchDetails();
    }, [username]);

    useEffect(() => {

        const getVideos = async () => {
            await axios.get(`/api/v1/videos/v/${owner?._id}`)
                        .then((reponse) => {
                            console.log(reponse.data.data);
                            setVideos(reponse.data.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        })

            await axios.get(`/api/v1/playlists/user/${owner?._id}`)
                        .then((response) => {
                            console.log(response.data.data);
                            setPlaylists(response.data.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        })

            await axios.get(`/api/v1/tweets/users/${owner?._id}`)
                        .then((response) => {
                            console.log(response.data.data)
                            setPosts(response.data.data);
                        })
                        .catch((error) => {
                            console.log('error');
                        })
        }

        getVideos();
    }, [owner]);

    const handleSubscribe = async() => {
        await axios.post(`/api/v1/subscriptions/c/${owner?._id}`)
                    .then((response) => {
                        console.log(response.data.data)
                        setOwner((prevOwner) =>
                            prevOwner
                                ? {
                                    ...prevOwner,
                                    isSubscribed: !prevOwner.isSubscribed,
                                    SubscribersCount: prevOwner.isSubscribed
                                        ? prevOwner.SubscribersCount - 1
                                        : prevOwner.SubscribersCount + 1,
                                }
                                : prevOwner
                        );
                    })
                    .catch((error) => {
                        console.log(error)
                    })
    }

    if (isLoading || !owner) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="relative">
                <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${owner.coverImage})` }}
                role="img"
                aria-label={`${owner.fullname}'s channel cover`}
                />
                <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                <Avatar className="w-24 h-24 border-4 border-background">
                    <AvatarImage src={owner.avatar} alt={owner.fullname} />
                    <AvatarFallback>{owner.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
                </div>
            </div>
            <div className="container mx-auto px-4 pt-16 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold">{owner.fullname}</h1>
                    <p className="text-muted-foreground">@{owner.username}</p>
                    <div className="flex gap-2 mt-2">
                        <p className="text-muted-foreground">{owner.SubscribersCount} subscribers</p>
                        <p>&bull;</p>
                        <p className="text-muted-foreground">{videos?.length || 0} videos</p>
                    </div>
                </div>
                <Button variant={owner.isSubscribed ? "secondary" : "default"} onClick={handleSubscribe} className="mt-4 md:mt-0">
                    {owner.isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
                </div>
                <Tabs defaultValue="videos" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="sticky top-0 bg-background z-10">
                    <TabsTrigger value="videos">Videos ({videos?.length || 0})</TabsTrigger>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="playlists">Playlists</TabsTrigger>
                </TabsList>
                <TabsContent value="videos">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {videos?.map((video) => (
                        <Card key={video._id} className="flex flex-col">
                        <CardHeader className="p-0">
                            <img
                            src={video.Thumbnail}
                            alt={`Thumbnail for ${video.title}`}
                            className="w-full aspect-video object-cover rounded-t-md"
                            />
                        </CardHeader>
                        <CardContent className="flex-grow p-2">
                            <CardTitle className="text-sm line-clamp-2">{video.title}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                {video.views} views &bull; {new Date(video.createdAt).toLocaleDateString()}
                            </p>
                        </CardContent>
                        <CardFooter className="p-2">
                            <Link href={`/${video._id}`} className="w-full">
                            <Button size="sm" className="w-full">Watch Now</Button>
                            </Link>
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                </TabsContent>
                <TabsContent value="posts">
                    <div className="space-y-4">
                    {posts?.map((post) => (
                        <Card key={post._id} onClick={() => router.push(`/post/${post._id}`)} className="cursor-pointer"> 
                        <CardContent className="pt-4">
                            <div className="my-4 flex items-center gap-3">
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={owner.avatar} />
                                    <AvatarFallback>{owner.fullname[0]}</AvatarFallback>
                                </Avatar>

                                <div className="font-semibold">
                                    {owner.fullname}
                                </div>
                            </div>
                            <div>
                                <p>{post.content}</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                        </Card>
                    ))}
                    </div>
                </TabsContent>
                <TabsContent value="playlists">
                    <div className="text-center py-8">
                    {(!playlists || (playlists.length === 0)) ? <p className="text-muted-foreground">Playlist section coming soon...</p>:
                    <div>
                    <h1 className="text-xl font-bold mb-6">Created playlists</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {playlists?.map((playlist) => (
                        <Card key={playlist._id} className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="relative aspect-video group">
                            <img
                                src={playlist.thumbnail}
                                alt={playlist.name}
                                className="transition-transform duration-300 group-hover:scale-105 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center cursor-pointer" onClick={() => router.push(`/playlist/${playlist._id}`)}>
                                <PlayIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={48}  />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm font-medium">
                                {playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'}
                            </div>
                            </div>
                            <CardContent className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{playlist.name}</h2>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{playlist.description}</p>
                            <Link 
                                href={`/playlist/${playlist._id}`} 
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                            >
                                View playlist
                            </Link>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                    </div>
                    }
                    </div>
                </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}