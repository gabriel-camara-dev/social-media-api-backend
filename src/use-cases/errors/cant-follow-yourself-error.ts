export class CantFollowYourselfError extends Error {
     constructor() {
          super('You cannot follow yourself.')
     }
}