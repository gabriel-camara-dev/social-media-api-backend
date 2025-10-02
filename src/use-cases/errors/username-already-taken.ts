import { UserAlreadyExistsError } from "./user-already-exists-error";

export class UsernameAlreadyTakenError extends UserAlreadyExistsError {
     constructor() {
          super('Username already taken.')
     }
}