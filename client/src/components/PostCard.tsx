import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Post } from '../types';
import classNames from 'classNames';
import relativeTime from 'dayjs/plugin/relativeTime';
import ActionButton from './ActionButton';
import { useAuthState } from '../context/auth';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { VOTE } from '../querys/mutations/vote';
import { GETSUB } from '../querys/getSub';
import { DELETEPOST } from '../querys/mutations/deletePost';
import { GETPOSTS } from '../querys/getPosts';
dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  revalidate?: Function;
}

export default function PostCard({ post, revalidate }: PostCardProps) {
  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const [voteMutation, { data, loading, error }] = useMutation(VOTE, { refetchQueries: [GETSUB] })
  const [deletePostMutation, { data: deleteReturn, error: deleteError }] = useMutation(DELETEPOST, {
    update(cache) {
      const id = post.id
      const normalizedId = cache.identify({ id, __typename: 'Post' });
      cache.evict({ id: normalizedId });
      cache.gc();
    }
  })


  const isInSubPage = router.pathname === '/r/[sub]'; // /r/[sub]
  const vote = async (value) => {
    if (!authenticated) {
      router.push('/login');
      return

    }
    if (value === post.userVote) value = 0;
    try {
      voteMutation({
        variables: {
          identifier: post.identifier,
          slug: post.slug,
          value
        }
      })

    } catch (error) {
      console.log(error);
    }
  };
  const onDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePostMutation({
        variables: {
          identifier: post.identifier,
        }
      })
    }
  }
  return (
    <div
      key={post.identifier}
      id={post.identifier}
      className="flex mb-5 bg-white rounded"
    >
      {/*Vote Section*/}
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        {/* {UpVote} */}
        <div
          onClick={() => vote(1)}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
        >
          <i
            className={classNames('icon-arrow-up', {
              'text-red-500': post.userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{post.voteScore}</p>
        {/* {DownVote} */}
        <div
          onClick={() => vote(-1)}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
        >
          <i
            className={classNames('icon-arrow-down', {
              'text-blue-600': post.userVote === -1,
            })}
          ></i>
        </div>
      </div>
      {/*Post data Sec*/}
      <div className="w-full p-2">
        <div className="flex items-center">
          {!isInSubPage && (
            <>
              <Link href={`/r/${post.subName}`}>
                <a>
                  <Image
                    src={
                      post.sub?.imageUrl || '/images/aavatar_placeholder.png'
                    }
                    alt="placeholder"
                    width="18"
                    height="18"
                    className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                  ></Image>
                </a>
              </Link>
              <Link href={`/r/${post.subName}`}>
                <a className="text-xs font-bold cursor-pointer hover:underline">
                  /r/{post.subName}
                </a>
              </Link>
              <span className="mx-1 text-xs text-gray-600">•</span>
            </>
          )}
          <p className="text-xs text-gray-600">
            Posted by
            <Link href={`/u/${post.username}`}>
              <a className="mx-1 hover:underline">{`/u/${post.username}`}</a>
            </Link>
            <Link href={post.url}>
              <a className="mx-1 hover:underline">
                {dayjs(post.createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={post.url}>
          <a className="my-1 text-lg font-medium">{post.title}</a>
        </Link>
        {post.body && <p className="my-1 text-sm whitespace-pre-wrap">{post.body}</p>}
        <div className="flex">
          <Link href={post.url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{post.commentCount} Comments</span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </ActionButton>
          {user && user.username === post.username && (
            <div className="cursor-pointer" onClick={() => onDelete()}>
              <ActionButton >
                <i className="mr-1 fas fa-trash-alt fa-xs"></i>
                <span className="font-bold">Delete</span>
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
