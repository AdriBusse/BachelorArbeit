import { DeletePostResolver } from './../modules/post/deletePost';
import { DefollowSubResolver } from './../modules/subs/defollowSub';
import { FollowSubResolver } from './../modules/subs/followSub';
import { PostResolver } from './../modules/classResolvers/PostResolver';
import { SubResolver } from './../modules/classResolvers/SubResolver';
import { UserResolver } from './../modules/classResolvers/UserResolver';
import { GetPostsResolver } from './../modules/post/getPosts';
import { CommentOnPostResolver } from './../modules/post/commentOnPost';
import { GetPostResolver } from './../modules/post/getPost';
import { CreatePostResolver } from './../modules/post/createPost';
import { SearchSubResolver } from './../modules/subs/searchSub';
import { GetSubsResolver } from '../modules/subs/getSubs';
import { CreateSubResolver } from './../modules/subs/createSub';
import { ChangePasswordResolver } from './../modules/user/ChangePassword';
import { RegisterResolver } from './../modules/user/Register';
import { MeResolver } from './../modules/user/Me';
import { LogoutResolver } from './../modules/user/Logout';
import { LoginResolver } from './../modules/user/Login';
import { ForgetPasswordResolver } from './../modules/user/ForgetPassword';
import { ConfirmUserResolver } from './../modules/user/ConfirmUser';
import { buildSchema } from "type-graphql";
import { GetSubResolver } from '../modules/subs/getSub';
import { SubUploadResolver } from '../modules/subs/uploadImage';
import { VoteResolver } from '../modules/misc/vote';
import { topSubsResolver } from '../modules/misc/topSubs';
import { GetUserResolver } from '../modules/user/getUser';
import { CommentResolver } from '../modules/classResolvers/CommentResolver';
import { VoteClassResolver } from '../modules/classResolvers/VoteResolver';

export const createSchema = () => buildSchema({
    resolvers: [ConfirmUserResolver, ForgetPasswordResolver, LoginResolver, LogoutResolver, MeResolver, RegisterResolver, ChangePasswordResolver,
        CreateSubResolver, GetSubsResolver, GetSubResolver, SearchSubResolver, SubUploadResolver, FollowSubResolver, DefollowSubResolver,
        CreatePostResolver, GetPostResolver, GetPostsResolver, CommentOnPostResolver, DeletePostResolver,
        VoteResolver, topSubsResolver, GetUserResolver,
        UserResolver, VoteClassResolver, SubResolver, PostResolver, CommentResolver],

});