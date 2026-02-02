'use server'

import { getFoldersUncategorised } from './get-folders-uncategorised'
import { getWorkspaceFolders } from './get-workspace-folders'

type GetFoldersParams = { userId: string } | { userId: string; workspaceId: string }

export async function getFolders(params: GetFoldersParams) {
  if ('workspaceId' in params) {
    return getWorkspaceFolders(params.userId, params.workspaceId)
  }

  return getFoldersUncategorised(params.userId)
}

export const getUserFolders = async (params: GetFoldersParams) => getFolders(params)
