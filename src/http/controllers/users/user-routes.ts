import { FastifyInstance } from 'fastify'
import { register } from './register'
import { GetUserProfile } from './get-user-profile'
import { authentication } from '../../../middlewares/authentication'
import { followOrUnfollow } from './follow-or-unfollow'
import { listFollowing } from './list-following'
import { listFollowers } from './list-followers'
import { togglePrivateProfile } from './toggle-private-profile'
import { optionalAuthentication } from '../../../middlewares/optional-authentication'
import { updateUser } from './update-user'
import { deleteProfile } from './delete-profile'
import { upload } from '../../../lib/multer'
import { uploadProfilePicture } from './upload-profile-picture'
import { deleteProfilePicture } from './delete-profile-picture'
import { toggleLikeComment, toggleLikePost } from './toggle-like'
import { listUserContent } from './list-user-content'
import { getMyProfile } from './get-my-profile'
import { listMyContent } from './list-my-content'

export async function userRoutes(app: FastifyInstance) {
  app.post('', register)

  app.get('/profile/me', { preHandler: authentication }, getMyProfile)
  app.get('/me/content', { preHandler: authentication }, listMyContent)

  app.get(
    '/profile/:publicId',
    { preHandler: optionalAuthentication },
    GetUserProfile
  )
  app.get(
    '/:publicId/content',
    { preHandler: optionalAuthentication },
    listUserContent
  )

  app.post(
    '/upload-profile-picture',
    {
      preHandler: [authentication, upload.single('file')],
    },
    uploadProfilePicture
  )

  app.patch(
    '/like/post/:postId',
    { preHandler: [authentication] },
    toggleLikePost
  )

  app.patch(
    '/like/comment/:commentId',
    { preHandler: [authentication] },
    toggleLikeComment
  )

  app.post(
    '/follow-or-unfollow/:publicId',
    { preHandler: authentication },
    followOrUnfollow
  )

  app.patch(
    '/toggle-private-profile',
    { preHandler: authentication },
    togglePrivateProfile
  )

  app.patch('/update', { preHandler: authentication }, updateUser)

  app.get('/followers', { preHandler: authentication }, listFollowers)
  app.get('/following', { preHandler: authentication }, listFollowing)

  app.delete('/delete-profile', { preHandler: authentication }, deleteProfile)

  app.delete(
    '/profile-picture',
    { preHandler: authentication },
    deleteProfilePicture
  )
}
