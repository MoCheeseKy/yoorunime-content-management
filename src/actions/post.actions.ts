"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

export async function createPost(data: any) {
  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        description: data.description || null,
        caption: data.caption || null,
        hashtags: data.hashtags || null,
        status: data.status as PostStatus,
        rejectReason: data.rejectReason || null,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error: any) {
    console.error("Error creating post:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePost(id: string, data: any) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        caption: data.caption || null,
        hashtags: data.hashtags || null,
        status: data.status as PostStatus,
        rejectReason: data.rejectReason || null,
      },
    });

    revalidatePath("/");
    revalidatePath(`/posts/${id}`);
    return { success: true, post };
  } catch (error: any) {
    console.error("Error updating post:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return { success: false, error: error.message };
  }
}
