'use server'

import type { ResponseError, UrlDataFetcher } from './types'

function getVideoId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
  return match?.[1]
}

export async function youtubeMetadataFetcher(
  videoUrl: string,
): Promise<[UrlDataFetcher, null] | [null, ResponseError]> {
  const videoId = getVideoId(videoUrl)

  if (!videoId) return [null, { success: false, message: 'Failed to get video id.' }]

  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet`

  const response = await fetch(url)

  const data = await response.json()
  if (!data.items.length) {
    return [null, { success: false, message: 'Failed to get video data.' }]
  }

  const video = data.items[0].snippet

  return [
    {
      title: video.title,
      favicon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',
      ogImage: video.thumbnails.maxres?.url || video.thumbnails.high.url,
      description: video.description,
      bookmarkUrl: videoUrl,
    },
    null,
  ]
}
