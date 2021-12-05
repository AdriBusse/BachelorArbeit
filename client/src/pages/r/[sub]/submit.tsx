import { gql, useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { GETSUB } from '../../../querys/getSub';
import { GETSUBFORCREATEPOST } from '../../../querys/getSubForCreatePost';
import { CREATEPOST } from '../../../querys/mutations/createPost';
import { Post, Sub } from '../../../types';

export default function submit() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const router = useRouter();
  const { sub: subName } = router.query;
  const { data: sub, loading, error } = useQuery<Sub>(GETSUBFORCREATEPOST, { variables: { name: subName } })
  const [createPostMutation, { loading: postloading, data: postdata, error: posterror }] = useMutation(CREATEPOST, {
    onCompleted: (data) => {
      console.log(data);
      router.push(`/r/${sub.name}/${data.createPost.identifier}/${data.createPost.slug}`);

    },
    update(cache, { data: { createPost } }) {
      cache.modify({
        fields: {
          getPosts(existingPosts = []) {
            const newPostRef = cache.writeFragment({
              data: createPost,
              fragment: gql`
                fragment NewPost on Post {
                  id
                  type
                }
              `
            });
            return [...existingPosts, newPostRef];
          }
        }
      });
    }
  })


  if (error) router.push('/');

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') return;

    try {

      await createPostMutation({
        variables: {
          title: title.trim(),
          body,
          sub: subName
        }
      })

    } catch (error) {
      console.log(error);

    }
  };
  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Readit</title>
      </Head>
      <div className="w-160">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">Submit a post to {subName}</h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                maxLength={300}
                placeholder="Title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none"
                style={{ top: '11px', right: '10px' }}
              >
                {/**length of input eg: 3/300 */}
                {title.trim().length}/300
              </div>
            </div>

            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
              value={body}
              placeholder="Text (optional)"
              rows={4}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 blue button"
                type="submit"
                disabled={title.trim().length === 0}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <Sidebar sub={sub} />}
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   try {
//     const cookie = await req.headers.cookie;

//     if (!cookie) throw new Error('Missing Auth Token Cookie');

//     return { props: {} };
//   } catch (error) {
//     // @ts-ignore
//     res.writeHead(307, { Location: '/login' }).end();
//   }
// };
