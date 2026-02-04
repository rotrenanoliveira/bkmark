'use server'

import z from 'zod'
import { type ResponseError, type UrlData, type UrlDataFetcher, urlDataSchema } from '@/utils/types'
import { axiosFetcher, kyFetcher, mqlFetcher, mqlYouTubeFetcher } from '@/utils/url-data-fetcher'
import { youtubeMetadataFetcher } from '@/utils/youtube-api'

type GetUrlDataArgs = {
  url: string
  fetcher?: 'axios' | 'ky' | 'microlink' | 'youtube-api'
}

/**
 * Fetches the data from the given URL.
 * Data includes title, favicon, ogImage, description and bookmarkUrl.
 */
export async function getUrlData({
  url,
  fetcher = 'axios',
}: GetUrlDataArgs): Promise<[UrlData, null] | [null, ResponseError]> {
  let response: UrlDataFetcher | null = null

  if (fetcher === 'axios') {
    const [axiosResponse, axiosError] = await axiosFetcher(url)

    if (axiosError) {
      return await getUrlData({ url, fetcher: 'ky' })
    }

    response = axiosResponse
  }

  if (fetcher === 'ky') {
    const [kyResponse, kyError] = await kyFetcher(url)

    if (kyError) {
      return await getUrlData({ url, fetcher: 'microlink' })
    }

    response = kyResponse
  }

  if (fetcher === 'microlink') {
    const isYouTubeVideo = url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')

    const [metadataResponse, metadataError] = isYouTubeVideo ? await mqlYouTubeFetcher(url) : await mqlFetcher(url)

    if (metadataError) {
      return [null, metadataError]
    }

    response = metadataResponse
  }

  if (fetcher === 'youtube-api') {
    const [metadataResponse, metadataError] = await youtubeMetadataFetcher(url)

    if (metadataError) {
      return [null, metadataError]
    }

    response = metadataResponse
  }

  if (!response) {
    return [null, { success: false, message: 'Failed to fetch data.' }]
  }

  if (response.bookmarkUrl === undefined || response.ogImage === undefined) {
    if (response.title === undefined || response.bookmarkUrl === 'undefined') {
      return await getUrlData({ url, fetcher: 'microlink' })
    }

    response.bookmarkUrl = url
  }

  let faviconUrl = response.favicon

  if (faviconUrl) {
    const [_, faviconResponseError] = await axiosFetcher(faviconUrl)

    if (faviconResponseError) {
      faviconUrl = null
    }
  }

  const urlData = urlDataSchema.safeParse({
    title: response.title,
    favicon: faviconUrl,
    ogImage: response.ogImage,
    description: response.description,
    bookmarkUrl: response.bookmarkUrl,
  })

  if (urlData.success === false) {
    return [null, { success: false, message: z.prettifyError(urlData.error).replace('✖ ', '') }]
  }

  return [urlData.data, null]
}
