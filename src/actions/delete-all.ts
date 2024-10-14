'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/db';
import paths from '@/paths';

interface DeleteFormState {
  errors: {
    _form?: string[];
  };
}

export async function deleteAll(
  formData: FormData
): Promise<DeleteFormState> {

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ['You must be signed in to do this'],
      },
    };
  }

  try {
    await db.comment.deleteMany({});
    await db.post.deleteMany({});
    await db.topic.deleteMany({});

  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ['Failed to delete all records'],
        },
      };
    }
  }

  revalidatePath(paths.home());
  redirect(paths.home());
}
