import { PrismaClient, Posts } from '@prisma/client'

export async function seedPosts(
  prisma: PrismaClient,
  adminPublicId: string
): Promise<Posts[]> {
  const contents = [
    'Primeiro post do admin! Bem-vindos à plataforma!',
    'Segundo post aqui. Como estão todos hoje?',
    'Terceiro post do admin. Obrigado por fazerem parte desta comunidade!',
  ]

  const createdPosts: Posts[] = []

  for (const content of contents) {
    const post = await prisma.posts.create({
      data: {
        content,
        author: {
          connect: { publicId: adminPublicId },
        },
      },
    })
    createdPosts.push(post)
  }

  return createdPosts
}
