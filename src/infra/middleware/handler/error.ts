import UserEntity from "../../../domain/user/user.entity";

class UserCreationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserCreationError'
    }
}

export {
    UserCreationError
}
