import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { slugify } from '@/lib/utilities/slug';

export async function POST(request: Request) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { 
      title, 
      content, 
      metaDescription, 
      slug: customSlug, 
      category = 'SEO', 
      featuredImage = 'https://theindianwings.com/placeholder.jpg',
      authorName = 'The Indian Wings' 
    } = data;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const generatedSlug = customSlug || slugify(title);

    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug: generatedSlug,
        content,
        excerpt: metaDescription || '',
        category,
        imageUrl: featuredImage,
        authorName,
        seoTitle: `${title} | The Indian Wings`,
        seoDescription: metaDescription || '',
        isPublished: true,
      },
    });

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error('Failed to create blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
