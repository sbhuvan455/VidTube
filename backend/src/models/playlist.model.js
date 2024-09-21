import mongoose, { Schema } from "mongoose";


const playlistSchema = new Schema({
    name: {
        type: "String",
        required: true
    },

    description: {
        type: "String",
    },

    thumbnail: {
        type: "String",
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ4AAACUCAMAAABV5TcGAAAAMFBMVEXp7vG6vsHs8fS2ur3k6ezX3N/EyczP1Nff4+bAxcfb4OPM0dTJzdC9wcTh5unv9Pd5IpRYAAADtUlEQVR4nO2di5KjIBBFtX0hgvz/3y4mxhFFTLJibLynUhOrYmQ807S8RrMMAAAAAAAAAAAAAAAAAAAAAAAAcyg2vz7BD7C/bBkbW8qvT/NNqKw6VUdGNZKFECJZ6/wEtBLX90FZc4qMgVZe30d1low8L9qrxwdJXZzoQ5XX9lF2J9qwVL8+4SAkXomjiMxYTN1fOjxemaPtmqh0o3Z97WzajDZk7IJe3qsL66BRR1HHTnEk2usnj0lH9IwPHW5J0OGUBB1OSax1kCEyxhxYEmMdpqyUrnXbCDrKCF8dRF3+aEXatmQrD/LBVocR+awbUyhzSFbhqsMsOvyFPsQHUx0k8gWFurGOrF3qyIvqgPzBUwf5xsb0AeHBU0e5Do7hFP4/PFjqIOkbRi7qu+pofMGR630d1Jfhz1nq6Lw68t0DGVGocEkp6Qj/5Z+X57CPpHTsHeYxAF10wV046vDPQemdo4wJ2PrYvCTz1NF7JyhVMJX+XY4C9YWljqysfTqCkwHzi/O2D546vLWlDh5Czltum/mDqY7MEx6heWbXxnb+4KnDZo9VM70JZI51M9bWF58Ppjpsg2rhowms6/I16v0+uOqw8VHPhsN0aBJxWVMC9YWtjmGp2Gt1VNuJwFiY34bfB18dGZlSNp1SXdWHRtK3bHjrC2Mdz1Wmj5+h727aeBxvuTdnHe8QsOGbx0pcR9CGJ97S1rFjY3XItHXs2rC46TlhHaEsuuEjFR3kaUO8Z8PxkYgOEs3Sx9s2rI9p2WQaOmyPrlj4+MBGnk9L8JLQYftztvvitrk/sfFXX1LQYcbe/tzHZzam+pKAjr+R02762DtNF6RKRIe1MXX0x/jwT1reQsczbzg+PsqiaelYjhKqzHwTG4nooOUYoY2Pr2wkocMz/6TVFzUlDR2m904/3VSHWc8u3FiHZ67lxjrWWfTOOg6tKex1HG2Dt45j8wZ3HcfbYK3ju4Znqjoowr+gM9ZhNlYO3lTH1kJK6IAOVBZExxzocIAOB+hwQCp1OCE6NGMdWS/F8LIMG8O7kMPr7/2xMewh5ns6G7Kff/W5aI6njnglQYdTEnQ4JUGHUxJ0OCVx0DHdRq0WkcuZprtZ6MiVFDHp5WuW89I32ftujcL3XPyOpVTW596gs/n1Ge9QnRoeV7+9L5URem3bXD04MurVWS6K2QrEy2Lj46T60q7Wc18RyirVxjaidd0JLo8WKEUVG9lzCI2R6E+c4PXQCQAAAAAAAAAAAAAAAAAAAADuzD/HDkRvpMXIzAAAAABJRU5ErkJggg=="
    },

    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

}, {timestamps: true})


export const Playlist = mongoose.model('Playlist', playlistSchema)