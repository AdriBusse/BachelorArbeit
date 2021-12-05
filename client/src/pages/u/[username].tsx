import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import PostCard from '../../components/PostCard';
import { useAuthState } from '../../context/auth';
import { GETUSER } from '../../querys/getUser';

import { Post, Comment } from '../../types';

export default function user() {
  const router = useRouter();
  const { username } = router.query;
  const { authenticated, user } = useAuthState();



  let { loading, data, error } = useQuery(GETUSER, { variables: { username }, skip: !username });

  console.log(data);
  console.log(error);


  return (
    <div>

      <Head>
        <title>{data?.getUser.username || 'Loading'}</title>
      </Head>
      {!loading && data && (
        <div className="container flex pt-5">
          <div className="w-160">
            {data.getUser.userSubmissions.map((submission: any) => {
              if (submission.__typename === 'Post') {
                const post: Post = submission;
                return <PostCard key={post.identifier} post={post} />;
              } else {
                const comment: Comment = submission;

                return (
                  <div
                    key={comment.identifier}
                    className="flex my-4 bg-white rounded"
                  >
                    <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l">
                      <i className="mr-1 text-gray-500 fas fa-comment-alt fa-xs"></i>
                    </div>
                    <div className="w-full p-2">
                      <p className="mb-2 text-xs text-gray-500">
                        <span className="font-semibold">
                          {comment.username}
                        </span>
                        <span> commented on </span>
                        <Link href={comment.post.url}>
                          <a
                            href=""
                            className="font-semibold cursor-pointer hover:underline"
                          >
                            {comment.post.title}
                          </a>
                        </Link>
                        <span className="mx-1">•</span>
                        <Link href={`/r/${comment.post.subName}`}>
                          <a
                            href=""
                            className="text-black cursor-pointer hover:underline"
                          >
                            /r/{comment.post.subName}
                          </a>
                        </Link>
                      </p>
                      <hr />
                      <p>{comment.body}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="ml-6 w-80">
            <div className="bg-white rounded ">
              <div className="p-3 bg-blue-500 rounded-t ">
                <img
                  src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  alt="user Profile"
                  className="w-16 h-16 mx-auto border-2 rounded-full"
                />
              </div>
              <div className="p-2 text-center">
                <h1 className="mb-1 text-xl ">{data.getUser.username}</h1>
                <hr />
                <p className="mt-3">
                  Joined {dayjs(data.getUser.createdAt).format('MMM YYYY')}
                </p>
                <hr />
                {user?.username === username &&

                  <Link href="/u/subs">
                    <a href="" className="w-full px-1 py-1 mt-2 blue button">
                      View all my Comunities
                    </a>
                  </Link>}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
