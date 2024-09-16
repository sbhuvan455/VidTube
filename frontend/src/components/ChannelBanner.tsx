interface Channel {
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

export const ChannelBanner = (props: Channel) => {
    return (
        <div>
            Channel Banner
        </div>
    )
}