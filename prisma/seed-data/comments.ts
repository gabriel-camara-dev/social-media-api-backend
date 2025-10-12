import { PrismaClient, Posts, Comment } from '@prisma/client'

export async function seedComments(
  prisma: PrismaClient,
  adminPublicId: string,
  posts: Posts[]
): Promise<void> {
  const [post1, post2, post3] = posts

  const comment1_post1 = await prisma.comment.create({
    data: {
      content: 'Ótimo primeiro post, admin!',
      author: { connect: { publicId: adminPublicId } },
      post: { connect: { publicId: post1.publicId } },
    },
  })

  const comment2_post1 = await prisma.comment.create({
    data: {
      content: 'Adorei a iniciativa!',
      author: { connect: { publicId: adminPublicId } },
      post: { connect: { publicId: post1.publicId } },
    },
  })

  const comment3_post1 = await prisma.comment.create({
    data: {
      content: 'Parabéns pelo lançamento!',
      author: { connect: { publicId: adminPublicId } },
      post: { connect: { publicId: post1.publicId } },
    },
  })

  const comment1_post2 = await prisma.comment.create({
    data: {
      content: 'Estou ótimo, obrigado!',
      author: { connect: { publicId: adminPublicId } },
      post: { connect: { publicId: post2.publicId } },
    },
  })

  const comment2_post2 = await prisma.comment.create({
    data: {
      content: 'Tudo bem por aqui!',
      author: { connect: { publicId: adminPublicId } },
      post: { connect: { publicId: post2.publicId } },
    },
  })

  const comment3_post2 = await prisma.comment.create({
    data: {
      content: 'Excelente dia hoje!',
      author: { connect: { publicId: adminPublicId } },
      post: { connect: { publicId: post2.publicId } },
    },
  })

  const comment1_post3 = await prisma.comment.create({
    data: {
      content: 'Obrigado por criar esta plataforma!',
      author: { connect: { publicId: adminPublicId } },
      post: { connect: { publicId: post3.publicId } },
    },
  })

  const comment2_post3 = await prisma.comment.create({
    data: {
      content: 'Comunidade incrível!',
      author: { connect: { publicId: adminPublicId } },
      post: { connect: { publicId: post3.publicId } },
    },
  })

  const comment3_post3 = await prisma.comment.create({
    data: {
      content: 'Estou adorando participar!',
      author: { connect: { publicId: adminPublicId } },
      post: { connect: { publicId: post3.publicId } },
    },
  })

  // Respostas (replies) usando createMany
  await prisma.comment.createMany({
    data: [
      {
        content: 'Concordo plenamente!',
        authorId: adminPublicId,
        postId: post1.publicId,
        parentId: comment1_post1.publicId,
      },
      {
        content: 'Muito bem dito!',
        authorId: adminPublicId,
        postId: post1.publicId,
        parentId: comment1_post1.publicId,
      },
      {
        content: 'Também achei excelente!',
        authorId: adminPublicId,
        postId: post1.publicId,
        parentId: comment1_post1.publicId,
      },
      {
        content: 'A iniciativa é realmente maravilhosa!',
        authorId: adminPublicId,
        postId: post1.publicId,
        parentId: comment2_post1.publicId,
      },
      {
        content: 'Estou muito animado!',
        authorId: adminPublicId,
        postId: post1.publicId,
        parentId: comment2_post1.publicId,
      },
      {
        content: 'Todos estão adorando!',
        authorId: adminPublicId,
        postId: post1.publicId,
        parentId: comment2_post1.publicId,
      },
      {
        content: 'Realmente parabéns!',
        authorId: adminPublicId,
        postId: post1.publicId,
        parentId: comment3_post1.publicId,
      },
      {
        content: 'Merece muitos elogios!',
        authorId: adminPublicId,
        postId: post1.publicId,
        parentId: comment3_post1.publicId,
      },
      {
        content: 'Sucesso garantido!',
        authorId: adminPublicId,
        postId: post1.publicId,
        parentId: comment3_post1.publicId,
      },
      {
        content: 'Que bom que está bem!',
        authorId: adminPublicId,
        postId: post2.publicId,
        parentId: comment1_post2.publicId,
      },
      {
        content: 'Fico feliz em saber!',
        authorId: adminPublicId,
        postId: post2.publicId,
        parentId: comment1_post2.publicId,
      },
      {
        content: 'Excelente notícia!',
        authorId: adminPublicId,
        postId: post2.publicId,
        parentId: comment1_post2.publicId,
      },
      {
        content: 'Ótimo saber que está tudo bem!',
        authorId: adminPublicId,
        postId: post2.publicId,
        parentId: comment2_post2.publicId,
      },
      {
        content: 'Isso que importa!',
        authorId: adminPublicId,
        postId: post2.publicId,
        parentId: comment2_post2.publicId,
      },
      {
        content: 'Continua assim!',
        authorId: adminPublicId,
        postId: post2.publicId,
        parentId: comment2_post2.publicId,
      },
      {
        content: 'Dia maravilhoso mesmo!',
        authorId: adminPublicId,
        postId: post2.publicId,
        parentId: comment3_post2.publicId,
      },
      {
        content: 'O tempo está ótimo!',
        authorId: adminPublicId,
        postId: post2.publicId,
        parentId: comment3_post2.publicId,
      },
      {
        content: 'Perfeito para conversar!',
        authorId: adminPublicId,
        postId: post2.publicId,
        parentId: comment3_post2.publicId,
      },
      {
        content: 'A plataforma é incrível!',
        authorId: adminPublicId,
        postId: post3.publicId,
        parentId: comment1_post3.publicId,
      },
      {
        content: 'Muito obrigado ao admin!',
        authorId: adminPublicId,
        postId: post3.publicId,
        parentId: comment1_post3.publicId,
      },
      {
        content: 'Está sendo fantástico!',
        authorId: adminPublicId,
        postId: post3.publicId,
        parentId: comment1_post3.publicId,
      },
      {
        content: 'A comunidade está crescendo!',
        authorId: adminPublicId,
        postId: post3.publicId,
        parentId: comment2_post3.publicId,
      },
      {
        content: 'Pessoas maravilhosas aqui!',
        authorId: adminPublicId,
        postId: post3.publicId,
        parentId: comment2_post3.publicId,
      },
      {
        content: 'Todos são muito legais!',
        authorId: adminPublicId,
        postId: post3.publicId,
        parentId: comment2_post3.publicId,
      },
      {
        content: 'Eu também estou adorando!',
        authorId: adminPublicId,
        postId: post3.publicId,
        parentId: comment3_post3.publicId,
      },
      {
        content: 'Participação ativa é tudo!',
        authorId: adminPublicId,
        postId: post3.publicId,
        parentId: comment3_post3.publicId,
      },
      {
        content: 'Vamos continuar assim!',
        authorId: adminPublicId,
        postId: post3.publicId,
        parentId: comment3_post3.publicId,
      },
    ],
  })
}
