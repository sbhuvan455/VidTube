"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon, UsersIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Subscription {
  _id: string;
  subscriber: string;
  channel: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  owner: any[];
}

export default function Component() {

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async() => {
        await axios.get(`/api/v1/subscriptions/c/get-subscribed-channels`)
                    .then((response) => {
                        console.log(response.data.data)
                        setSubscriptions(response.data.data);
                    })
                    .catch((error) => console.log(error.response.data.message))
    }

    fetchDetails();
  }, []);


  const handleUnsubscribe = async(channelId: string) => {
      await axios.post(`/api/v1/subscriptions/c/${channelId}`)
                  .then((response) => {
                      console.log(response)
                      setSubscriptions(subscriptions.filter((subscription) => subscription.owner[0]._id !== channelId))
                  })
                  .catch((error) => {
                      console.log(error)
                  })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Subscribed Channels</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((channel) => (
          <div key={channel.owner[0].fullname} className="flex items-center space-x-4 bg-card p-4 rounded-lg shadow">
            <Avatar className="h-12 w-12">
              <AvatarImage src={channel.owner[0].avatar} alt={channel.owner[0].fullname} />
              <AvatarFallback>{channel.owner[0].fullname[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{channel.owner[0].fullname}</p>
            </div>
            <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => handleUnsubscribe(channel.owner[0]._id)}>
                    Unsubscribe
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push(`/c/${channel.owner[0].username}`)}>
                    View Channel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}