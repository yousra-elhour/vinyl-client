This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Spotify API Setup

To enable the music player functionality, you need to set up Spotify API credentials:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and log in
2. Create a new app
3. Copy the Client ID and Client Secret
4. Create a `.env.local` file in the root of your project with the following content:

```
# Spotify API Credentials
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# YouTube API Key (Optional - for better music preview fallbacks)
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
```

5. Replace `your_spotify_client_id` and `your_spotify_client_secret` with the values from your Spotify Developer Dashboard
6. (Optional) For YouTube integration, get an API key from [Google Cloud Console](https://console.cloud.google.com/apis/dashboard) and enable the YouTube Data API
7. Restart your development server
