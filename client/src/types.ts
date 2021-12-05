export interface Post {
  id: string;
  identifier: string;
  title: string;
  slug: string;
  subName: string;
  createdAt: string;
  updatedAt: string;
  body?: string;
  username: string;
  sub?: Sub;
  //Virtuell fields
  url: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}

export interface User {
  username: string;
  email: string;
  followedSubs: Sub[],
  createdAt: string;
  updatedAt: string;
}

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  describtion: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: Post[];
  followerCount: number;
  userFollows: number;
  //virtuals
  imageUrl: string;
  bannerUrl: string;
  postCount?: number;
}

export interface Comment {
  createdAt: string;
  updated: string;
  identifier: string;
  body: string;
  username: string;
  userVote: number;
  voteScore: number;
  post?: Post;
}

export interface RegisterInput {
  username: string,
  email: string,
  password: string
}