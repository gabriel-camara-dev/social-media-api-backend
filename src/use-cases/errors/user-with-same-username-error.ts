import { UserAlreadyExistsError } from "./user-already-exists-error";

export class UserWithSameUsernameError extends UserAlreadyExistsError {
     constructor() {
          super('There is already an user with the same username.')
     }
}