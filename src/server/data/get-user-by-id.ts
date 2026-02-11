'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'

export async function getUserById(userId: string) {
  const [user, queryError] = await handle(
    db
      .select({ userId: bookmarksRepository.userId })
      .from(bookmarksRepository)
      .where(eq(bookmarksRepository.userId, userId)),
  )

  if (queryError) {
    throw queryError.message
  }

  return user.length > 0 ? user[0] : null
}
