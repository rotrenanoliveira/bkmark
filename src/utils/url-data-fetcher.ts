'use server'

import mql from '@microlink/mql'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import ky from 'ky'

import type { ResponseError, UrlDataFetcher } from '@/utils/types'
import { fetcher } from './fetcher'

/** Fetches the data from the given URL using axios */
export async function axiosFetcher(url: string): Promise<[UrlDataFetcher, null] | [null, ResponseError]> {
  const [response, requestError] = await fetcher(
    axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      responseType: 'text',
      timeout: 1000 * 10, // 10 seconds
      signal: AbortSignal.timeout(1000 * 10),
    }),
  )

  if (requestError) {
    return [null, requestError]
  }

  if (response.status !== 200) {
    return [null, { success: false, message: `Failed to fetch url. ${response.status}` }]
  }

  if (!response.data) {
    return [null, { success: false, message: 'Failed to fetch data.' }]
  }

  const websiteData = response.data

  const html = websiteData
  const dom = new JSDOM(html)
  const document = dom.window.document

  const favicon = document.querySelector("link[rel~='icon']")?.getAttribute('href') || '/favicon.ico'
  const resolvedFavicon = new URL(favicon, url).toString()

  const title =
    document.querySelector('title')?.textContent ||
    document.querySelector("meta[property='og:title']")?.getAttribute('content')

  const ogImage =
    document.querySelector("meta[property='og:image']")?.getAttribute('content') ||
    document.querySelector("meta[property='og:image:url']")?.getAttribute('content')

  const description = document.querySelector("meta[name='description']")?.getAttribute('content')

  const bookmarkUrl = document.querySelector("link[rel='canonical']")?.getAttribute('href')

  return [
    {
      title,
      ogImage,
      favicon: resolvedFavicon,
      description,
      bookmarkUrl,
    },
    null,
  ]
}

/** Fetches the data from the given URL using ky */
export async function kyFetcher(url: string): Promise<[UrlDataFetcher, null] | [null, ResponseError]> {
  const [kyResponse, kyRequestError] = await fetcher(ky.get(url).text())

  if (kyRequestError) {
    return [null, kyRequestError]
  }

  if (!kyResponse) {
    return [null, { success: false, message: 'Failed to fetch url.' }]
  }

  const kyData = await ky.get(url).text()

  const websiteData = kyData

  const html = websiteData
  const dom = new JSDOM(html)
  const document = dom.window.document

  const favicon = document.querySelector("link[rel~='icon']")?.getAttribute('href') || '/favicon.ico'
  const resolvedFavicon = new URL(favicon, url).toString()

  const title =
    document.querySelector('title')?.textContent ||
    document.querySelector("meta[property='og:title']")?.getAttribute('content')

  const ogImage =
    document.querySelector("meta[property='og:image']")?.getAttribute('content') ||
    document.querySelector("meta[property='og:image:url']")?.getAttribute('content')

  const description = document.querySelector("meta[name='description']")?.getAttribute('content')

  const bookmarkUrl = document.querySelector("link[rel='canonical']")?.getAttribute('href')

  return [
    {
      title,
      ogImage,
      favicon: resolvedFavicon,
      description,
      bookmarkUrl,
    },
    null,
  ]
}

/** Fetches the data from the given URL using microlink */
export async function mqlFetcher(url: string): Promise<[UrlDataFetcher, null] | [null, ResponseError]> {
  const [mqlResponse, mqlError] = await fetcher(mql(url, { meta: true }))

  if (mqlError) {
    return [null, mqlError]
  }

  if (!mqlResponse) {
    return [null, { success: false, message: 'Failed to fetch url.' }]
  }

  const { status, data } = mqlResponse

  if (status !== 'success') {
    return [null, { success: false, message: `Failed to fetch url. ${status}` }]
  }

  return [
    {
      title: data.title,
      description: data.description,
      favicon: data.logo?.url,
      ogImage: data.image?.url,
      bookmarkUrl: data.url,
    },
    null,
  ]
}

export async function mqlYouTubeFetcher(url: string): Promise<[UrlDataFetcher, null] | [null, ResponseError]> {
  const [mqlResponse, mqlError] = await fetcher(mql(url, { meta: true, prerender: true, video: true, audio: true }))

  if (mqlError) {
    return [null, mqlError]
  }

  if (!mqlResponse) {
    return [null, { success: false, message: 'Failed to fetch url.' }]
  }

  const { status, data } = mqlResponse

  if (status !== 'success') {
    return [null, { success: false, message: `Failed to fetch url. ${status}` }]
  }

  return [
    {
      title: data.title,
      description: data.description,
      favicon: data.logo?.url,
      ogImage: data.image?.url,
      bookmarkUrl: url,
    },
    null,
  ]
}
