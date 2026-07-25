"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { PostStatus, PostType } from "@/generated/prisma/client";

export async function getFormData() {
  const admins = await prisma.admin.findMany({ orderBy: { codename: 'asc' } });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return { admins, categories };
}

async function handleAdminAndCategory(adminIdOrName: string, categoryIdOrName: string) {
  let adminId = undefined;
  if (adminIdOrName) {
    const existingAdmin = await prisma.admin.findFirst({ where: { OR: [{ id: adminIdOrName }, { codename: adminIdOrName }] } });
    if (existingAdmin) adminId = existingAdmin.id;
    else {
      const newAdmin = await prisma.admin.create({ data: { codename: adminIdOrName } });
      adminId = newAdmin.id;
    }
  }

  let categoryId = undefined;
  if (categoryIdOrName) {
    const existingCat = await prisma.category.findFirst({ where: { OR: [{ id: categoryIdOrName }, { name: categoryIdOrName }] } });
    if (existingCat) categoryId = existingCat.id;
    else {
      const newCat = await prisma.category.create({ data: { name: categoryIdOrName } });
      categoryId = newCat.id;
    }
  }
  return { adminId, categoryId };
}

export async function createPost(data: any) {
  try {
    const { adminId, categoryId } = await handleAdminAndCategory(data.adminId, data.categoryId);

    const post = await prisma.post.create({
      data: {
        title: data.title,
        description: data.description || null,
        caption: data.caption || null,
        hashtags: data.hashtags || null,
        status: data.status as PostStatus,
        rejectReason: data.rejectReason || null,
        type: (data.type as PostType) || 'POST',
        slidesDescription: data.slidesDescription || null,
        adminId,
        categoryId,
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
    const { adminId, categoryId } = await handleAdminAndCategory(data.adminId, data.categoryId);

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        caption: data.caption || null,
        hashtags: data.hashtags || null,
        status: data.status as PostStatus,
        rejectReason: data.rejectReason || null,
        type: (data.type as PostType) || 'POST',
        slidesDescription: data.slidesDescription || null,
        adminId,
        categoryId,
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

// Fitur Data Bulanan
export async function updateMonitoringData(id: string, data: any) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        instagramLink: data.instagramLink,
        likesRange: data.likesRange,
        repostCount: data.repostCount ? parseInt(data.repostCount) : 0,
        shareCount: data.shareCount ? parseInt(data.shareCount) : 0,
        postedAt: data.postedAt ? new Date(data.postedAt) : null,
      }
    });
    revalidatePath("/monitoring");
    return { success: true, post };
  } catch (error: any) {
    console.error("Error updating monitoring data:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMonitoringData(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: {
        instagramLink: null,
        likesRange: null,
        repostCount: 0,
        shareCount: 0,
        postedAt: null,
      }
    });
    revalidatePath("/monitoring");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting monitoring data:", error);
    return { success: false, error: error.message };
  }
}
