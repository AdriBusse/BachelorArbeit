import { useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import router from 'next/router';
import React, { FormEvent, useState } from 'react'
import { useAuthState } from '../../../../../context/auth';
import { GETPOST } from '../../../../../querys/getPost';
import { DELETEPOST } from '../../../../../querys/mutations/deletePost';
import { Comment } from '../../../../../types';
import Image from 'next/image';
import ActionButton from '../../../../../components/ActionButton';
import Sidebar from '../../../../../components/Sidebar';
import { VOTE } from '../../../../../querys/mutations/vote';
import { COMMENTONPOST } from '../../../../../querys/mutations/commentOnPost';
import Head from 'next/head';
import classNames from 'classNames';
import { printCache } from '../../../../../apollo-client';


dayjs.extend(relativeTime);

interface Props {
  identifier: string;
  slug: string;
  sub: string;
}
function PostDetail({ identifier, slug, sub }: Props) {
  //localState
  const [newComment, setNewComment] = useState('');
  //globalState
  const { authenticated, user } = useAuthState();


  // console.log(printCache());

  //utils

  const [commentOPMutation, { loading: loadingcomment, data: datacomment, error: errorcomment }] = useMutation(COMMENTONPOST)
  const [voteMutation, { loading: loadingvote, data: datavote, error: errorvote }] = useMutation(VOTE)
  const { data: post, loading, error } = useQuery(GETPOST, { variables: { identifier, slug }, skip: (!slug || !identifier) })

  const [deletePostMutation, { data: deleteReturn, error: deleteError }] = useMutation(DELETEPOST, {
    update(cache) {
      const id = post.getPost.id
      console.log(id);

      const normalizedId = cache.identify({ id, __typename: 'Post' });
      cache.evict({ id: normalizedId });
      cache.gc();
    },
    onCompleted() {
      router.push('/')
    }
  })
  // console.log(user?.username, post?.getPost.username);

  const onDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePostMutation({
        variables: {
          identifier: post.getPost.identifier,
        }
      })
    }
  }

  // if (error) router.push('/');


  const vote = async (value: number, comment?: Comment) => {
    if (!authenticated) router.push('/login');

    //If vote is the same then reset it
    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    )
      value = 0;
    try {

      if (comment) {
        voteMutation({
          variables: {
            identifier: post.getPost.identifier,
            slug: post.getPost.slug,
            value,
            commentIdentifier: comment?.identifier
          },
          refetchQueries: [GETPOST]
        })
      } else {
        voteMutation({
          variables: {
            identifier: post.getPost.identifier,
            slug: post.getPost.slug,
            value,
          },
          refetchQueries: [GETPOST]
        })
      }


    } catch (error) {
      console.log(error);
    }
  };
  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === '') return;

    try {
      await commentOPMutation({
        variables: {
          identifier,
          slug,
          body: newComment
        },
        refetchQueries: [GETPOST]
      })

      setNewComment('');
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return <div>"Loading..."</div>
  } else {

    return (
      <div>
        <Head>
          <title>{post?.getPost.title}</title>
        </Head>
        <Link prefetch={false} href={`/r/${sub}`}>
          <a>
            <div className="flex items-center w-full h-20 p-8 bg-blue-500">
              <div className="container flex">
                {post && (
                  <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                    <Image
                      src={post.getPost.sub.imageUrl}
                      height={(8 * 16) / 2}
                      width={(8 * 16) / 2}
                    ></Image>
                  </div>
                )}
                <p className="text-xl font-semibold text-white">/r/{sub}</p>
              </div>
            </div>
          </a>
        </Link>
        <div className="container flex pt-5">
          {/**Post */}
          <div className="w-160">
            <div className="bg-white rounded">
              {post && (
                <>
                  <div className="flex">
                    {/**Vote Section */}
                    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                      {/* {UpVote} */}
                      <div
                        onClick={() => vote(1)}
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      >
                        <i
                          className={classNames('icon-arrow-up', {
                            'text-red-500': post.getPost.userVote === 1,
                          })}
                        ></i>
                      </div>
                      <p className="text-xs font-bold">{post.getPost.voteScore}</p>
                      {/* {DownVote} */}
                      <div
                        onClick={() => vote(-1)}
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                      >
                        <i
                          className={classNames('icon-arrow-down', {
                            'text-blue-600': post.getPost.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                    <div className="py-2 pr-2">
                      <div className="flex items-center">
                        <p className="text-xs text-gray-600">
                          Posted by
                          <Link prefetch={false} href={`/u/${post.getPost.username}`}>
                            <a className="mx-1 hover:underline">{`/u/${post.getPost.username}`}</a>
                          </Link>
                          <Link prefetch={false} href={post.getPost.url}>
                            <a className="mx-1 hover:underline">
                              {dayjs(post.getPost.createdAt).fromNow()}
                            </a>
                          </Link>
                        </p>
                      </div>
                      <h1 className="my-1 text-xl font-medium">{post.getPost.title}</h1>
                      <p className="my-3 text-sm whitespace-pre-wrap">{post.getPost.body}</p>
                      {/**Actions */}
                      <div className="flex">
                        <Link prefetch={false} href={post.getPost.url}>
                          <a>
                            <ActionButton>
                              <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                              <span className="font-bold">
                                {post.getPost.commentCount} Comments
                              </span>
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
                        {user && user.username === post?.getPost.username && (
                          <div className="cursor-pointer" onClick={() => onDelete()}>
                            <ActionButton >
                              <i className="mr-1 fas fa-trash-alt fa-xs"></i>
                              <span className="font-bold">Delete</span>
                            </ActionButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/**Comments Feed */}
                  {/**Comments Input field */}
                  <div className="pl-10 pr-6 mb-4">
                    {authenticated ? (
                      <div>
                        <p className="mb-1 text-xs">
                          Comment as{' '}
                          <Link prefetch={false} href={`/u/${user.username}`}>
                            <a className="font-semibold text-blue-500">
                              {user.username}
                            </a>
                          </Link>
                        </p>
                        <form onSubmit={submitComment}>
                          <textarea
                            value={newComment}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gry-600"
                            onChange={(e) => setNewComment(e.target.value)}
                          ></textarea>
                          <div className="flex justify-end">
                            <button
                              disabled={newComment.trim() === ''}
                              className="px-3 py-1 mb-1 blue button"
                            >
                              Comment
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-2 py-4 border border-gray-300 rounded">
                        <p className="font-semibold text-gray-500">
                          LogIn or SignUp to leave a Comment
                        </p>
                        <Link prefetch={false} href="/login">
                          <a className="px-4 py-1 mr-4 hollow blue button">
                            Login
                          </a>
                        </Link>
                        <Link prefetch={false} href="/register">
                          <a className="px-4 py-1 blue button">SignUp</a>
                        </Link>
                      </div>
                    )}
                  </div>
                  {post.getPost.comments?.map((comment) => (
                    <div className="flex" key={comment.identifier}>
                      {/**Vote Section */}
                      <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                        {/* {UpVote} */}
                        <div
                          onClick={() => vote(1, comment)}
                          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                        >
                          <i
                            className={classNames('icon-arrow-up', {
                              'text-red-500': comment.userVote === 1,
                            })}
                          ></i>
                        </div>
                        <p className="text-xs font-bold">{comment.voteScore}</p>
                        {/* {DownVote} */}
                        <div
                          onClick={() => vote(-1, comment)}
                          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                        >
                          <i
                            className={classNames('icon-arrow-down', {
                              'text-blue-600': comment.userVote === -1,
                            })}
                          ></i>
                        </div>
                      </div>
                      <div className="py-2 pr-2">
                        <p className="leading-none mb-1-text-xs">
                          <Link prefetch={false} href={`/u/${comment.username}`}>
                            <a href="" className="mr-1 font-bold hover:underline">
                              {comment.username}
                            </a>
                          </Link>
                          <span className="text-gray-600">{` ${comment.voteScore
                            } points • ${dayjs(
                              comment.createdAt
                            ).fromNow()}`}</span>
                        </p>
                        <p className="whitespace-pre-wrap">{comment.body}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          {/**Sidebar */}
          {post && <Sidebar sub={post.getPost.sub} />}
        </div>
      </div>
    );
  }
}

export default PostDetail


