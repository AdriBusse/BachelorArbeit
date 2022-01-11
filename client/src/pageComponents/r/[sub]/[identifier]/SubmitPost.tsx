import { gql, useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import client, { printCache } from '../../../../apollo-client';
import Sidebar from '../../../../components/Sidebar';
import { GETPOST } from '../../../../querys/getPost';
import { GETPOSTS } from '../../../../querys/getPosts';
import { GETSUBFORCREATEPOST } from '../../../../querys/getSubForCreatePost';
import { CREATEPOST } from '../../../../querys/mutations/createPost';

interface Props {
    subName: string;
}

const SubmitPost = ({ subName }: Props) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    //console.log(printCache());

    const router = useRouter();
    const { data: sub, loading, error } = useQuery(GETSUBFORCREATEPOST, { variables: { name: subName }, skip: !subName });
    const [createPostMutation, { loading: postloading, data: postdata, error: posterror }] = useMutation(CREATEPOST, {
        onCompleted: (data) => {
            console.log(data);

            router.push(`/r/${subName}/${data.createPost.identifier}/${data.createPost.slug}`);

        },
        update(cache, { data: { createPost } }) {
            try {
                // const { posts } = cache.readQuery({ query: GETSUBFORCREATEPOST, variables: { name: subName } });
                const ref = cache.identify(createPost)
                //const { getPosts } = cache.readQuery({ query: GETPOSTS })
                //console.log("allposts:", getPosts);
                // update the cache
                cache.modify({
                    fields: {
                        getPosts(existingPosts = []) {
                            return [{ __ref: ref }, ...existingPosts];

                        },
                        getSub(existingSub = []) {
                            cache.modify({
                                id: existingSub.__ref,
                                fields: {
                                    posts(existingPosts = []) {
                                        return [{ __ref: ref }, ...existingPosts];
                                    }

                                }
                            })

                        }
                    }
                })



                //cache.writeQuery({ query: GETPOSTS, data: { getPosts: createPost } })
                //console.log(ref);

            } catch (err) {
                console.log(err);

            }
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
            {sub && <Sidebar sub={sub.getSub} />}
        </div>
    );
}

export default SubmitPost