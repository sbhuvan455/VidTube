"use client"

import axios from 'axios'
import React, { useEffect } from 'react'

function Dashboard() {

    useEffect(() => {

        const fetchDetails = async() => {
            axios.get('/api/v1/dashboard/stats')
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        fetchDetails();
    }, [])

    return (
        <div>
            Dashboard
        </div>
    )
}

export default Dashboard
