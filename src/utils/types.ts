import { z } from 'zod'

/**
 * Make some property optional on type
 *
 * @example
 * ```typescript
 * type Post {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optional<Post, 'id' | 'email'>
 * ```
 **/

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

/** standard response error */
export const responseError = z.object({
  success: z.literal(false),
  message: z.string(),
})

/** bookmark data fetcher */
export const urlDataFetcherSchema = z.object({
  title: z.string().nullish(),
  favicon: z.string().nullish(),
  ogImage: z.string().nullish(),
  description: z.string().nullish(),
  bookmarkUrl: z.string().nullish(),
})

/** bookmark data fetched from the url */
export const urlDataSchema = urlDataFetcherSchema.extend({
  title: z.string(),
  bookmarkUrl: z.string(),
})

/** bookmark */
export const bookmarkSchema = z.object({
  bookmarkId: z.string(),
  userId: z.string(),
  bookmarkUrl: z.string(),
  title: z.string(),
  favicon: z.string().nullish(),
  description: z.string().nullish(),
  ogImage: z.string().nullish(),
  createdAt: z.coerce.date(),
  folderId: z.string().nullish(),
  workspaceId: z.string().nullish(),
})

/** bookmark presenter */
export const bookmarkPresenterSchema = bookmarkSchema.omit({
  description: true,
  ogImage: true,
})

/** bookmark create input */
export const bookmarkCreateInputSchema = bookmarkSchema.omit({
  bookmarkId: true,
  createdAt: true,
})

/** bookmark update input */
export const bookmarkUpdateInputSchema = z.object({
  bookmarkId: z.string(),
  title: z.string().nullish(),
  folderId: z.string().nullish(),
  workspaceId: z.string().nullish(),
})

/** folder create input */
export const folderCreateInputSchema = z.object({
  userId: z.string().min(12, { message: 'Invalid user Id.' }).max(12, { message: 'Invalid user Id.' }),
  name: z.string().min(1, { message: 'Invalid folder name.' }),
  workspaceId: z
    .string()
    .min(12, { message: 'Invalid workspace Id.' })
    .max(12, { message: 'Invalid workspace Id.' })
    .nullish(),
})

/** folder update input */
export const folderUpdateInputSchema = z.object({
  folderId: z.string(),
  workspaceId: z.string().nullish(),
  // name: z.string().nullish(),
})

/** folder */
export const folderSchema = folderCreateInputSchema.extend({
  folderId: z.string().min(12, { message: 'Invalid folder Id.' }).max(12, { message: 'Invalid folder Id.' }),
})

/** workspace */
export const workspaceSchema = z.object({
  workspaceId: z.string().min(12, { message: 'Invalid workspace Id.' }).max(12, { message: 'Invalid workspace Id.' }),
  userId: z.string().min(12, { message: 'Invalid user Id.' }).max(12, { message: 'Invalid user Id.' }),
  name: z.string().min(1, { message: 'Invalid folder name.' }),
})

/** workspace create input */
export const workspaceCreateInputSchema = workspaceSchema.omit({
  workspaceId: true,
})

/** bookmark */
export type Bookmark = z.infer<typeof bookmarkSchema>
/** bookmark presenter */
export type BookmarkPresenter = z.infer<typeof bookmarkPresenterSchema>
/** bookmark create input */
export type BookmarkCreateInput = z.infer<typeof bookmarkCreateInputSchema>
/** bookmark update input */
export type BookmarkUpdateInput = z.infer<typeof bookmarkUpdateInputSchema>
/** folder */
export type Folder = z.infer<typeof folderSchema>
/** folder create input */
export type FolderCreateInput = z.infer<typeof folderCreateInputSchema>
/** folder update input */
export type FolderUpdateInput = z.infer<typeof folderUpdateInputSchema>
/** workspace */
export type Workspace = z.infer<typeof workspaceSchema>
/** workspace create input */
export type WorkspaceCreateInput = z.infer<typeof workspaceCreateInputSchema>
/** standard response error */
export type ResponseError = z.infer<typeof responseError>
/** bookmark data fetcher */
export type UrlDataFetcher = z.infer<typeof urlDataFetcherSchema>
/** bookmark data fetched from the url */
export type UrlData = z.infer<typeof urlDataSchema>
