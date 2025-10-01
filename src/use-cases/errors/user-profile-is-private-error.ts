export class UserProfileIsPrivateError extends Error {
     constructor(message: string = 'User profile is private.') {
          super(message)
     }
}