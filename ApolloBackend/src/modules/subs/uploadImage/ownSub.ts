import User from "../../../entity/User";
import { Sub } from "../../../entity/Sub";

export const ownSub = async (user: User, sub: Sub) => {
    if (sub.username === user.username) {
        return true
    }
    return false
}

