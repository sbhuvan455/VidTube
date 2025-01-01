
# VidTube

VidTube is a full-stack video streaming platform designed to provide users with a seamless video browsing and watching experience. Built using modern web technologies, it enables the upload, storage, and playback of videos.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Deployed Application](#deployed-application)

## Demo
<video src="https://github.com/user-attachments/assets/810699c6-cb1b-4e11-996d-3e8f0612c40a" controls="controls" muted="muted" playsinline="playsinline"></video>

## Features
- User authentication and authorization
- Video upload and playback
- User profiles with customizable avatars
- Video streaming from Cloudinary
- Responsive design with high-quality video presentation
- Secure and scalable backend
- Real-time data retrieval using MongoDB
- Integration with modern React UI components

## Tech Stack

### Frontend:
- **[Next.js](https://nextjs.org/)**: A powerful React framework for building high-performance web applications, leveraging features like server-side rendering and static site generation.
- **[Shadcn](https://ui.shadcn.com/)**: A component library for React that provides pre-built, customizable components for building a consistent UI/UX.
  
### Backend:
- **[Node.js](https://nodejs.org/)**: A JavaScript runtime for building scalable network applications. The backend powers user authentication, video management, and profile functionalities.

### Database:
- **[MongoDB](https://www.mongodb.com/)**: A NoSQL database that stores user profiles, video metadata, and application data, ensuring high performance and flexibility.

### Object Storage:
- **[Cloudinary](https://cloudinary.com/)**: Used for secure storage and fast streaming of uploaded video content. Cloudinary handles video optimization and delivery.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/sbhuvan455/VidTube.git
   cd VidTube
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory of the project.
   - Add your MongoDB URI, Cloudinary API keys, and other environment-specific variables.

   Example:
   ```bash
   MONGO_URI=your-mongodb-uri
   ACCESS_TOKEN_SECRET=your-access-token-secret-key
   REFRESH_TOKEN_SECRET=your-access-token-secret-key
   ACCESS_TOKEN_EXPIRY = "1d"
   REFRESH_TOKEN_EXPIRY = "10d"
   CLOUD_NAME=your-cloudinary-cloud-name
   API_KEY=your-cloudinary-api-key
   API_SECRET=your-cloudinary-api-secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and go to [http://localhost:3000](http://localhost:3000).

## Usage

### Login Credentials
For testing the platform, you can log in using the following credentials:
- **Email**: abc_trial3@gmail.com
- **Password**: abc_trial3

### Core Functionalities
- **Video Upload**: Users can upload videos, which will be stored and streamed via Cloudinary.
- **Create Profiles**: Each user can Create their profile, including setting an avatar.
- **Streaming**: Videos are streamed directly from Cloudinary, ensuring high performance and fast load times.
- **Manage Channel**: Users can upload videos, create Posts and playlists for their channel.


## Deployed Application
The project is deployed and live at [https://vid-tube-steel.vercel.app/](https://vid-tube-steel.vercel.app/). Feel free to explore the platform, test its features, and stream some videos!
