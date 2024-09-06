"use client"

import axios from 'axios';
import { useParams } from 'next/navigation'
import { useEffect } from 'react';


export default function Video(){

    const { videoId } = useParams();
    

    useEffect(() => {
        axios.get(`/api/v1/videos/${videoId}`)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => [
                console.log(error)
            ])
    }, [])

    return (
        <div>
            Video
        </div>
    )
}
