"use client";

import { Play, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface OwnerDetails {
  _id: string;
  fullname: string;
  avatar: string;
}

interface Video {
  _id: string;
  title: string;
  description: string;
  Thumbnail: string;
  duration: number;
  videoFile: string;
  views: number;
  createdAt: number;
  uploadedAt: string;
  ownerDetails: OwnerDetails[];
}

export default function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    axios
      .get("/api/v1/videos/")
      .then((response) => {
        setVideos(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Card key={video._id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={video.Thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {formatDuration(video.duration)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={video.ownerDetails[0]?.avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold leading-tight truncate">
                    {video.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {video.ownerDetails[0]?.fullname || "Unknown User"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatViews(video.views)} views • {video.createdAt}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-1">
                {video.description}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="secondary" className="w-full" asChild>
                <Link href={`/${video._id}`} rel="noopener noreferrer">
                  <Play className="mr-2 h-4 w-4" /> Watch Now
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  const seconds = Math.floor((minutes * 60) % 60);

  if (hours > 0) {
    return `${hours}:${remainingMinutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${remainingMinutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  } else {
    return views.toString();
  }
}
