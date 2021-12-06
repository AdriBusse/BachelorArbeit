import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { FormEvent, useState } from 'react';
import classNames from 'classNames';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { CREATESUB } from '../../querys/mutations/createSub';

export default function create() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [describtion, setDescribtion] = useState('');
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const [createSubMutation, { data, error, loading }] = useMutation(CREATESUB, {
    onCompleted: (data) => {
      // router.reload()
      router.push(`/r/${data.createSub.name}`);

    },
    onError: (error) => {
      setErrors(error.message)
    }
  })
  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await createSubMutation({
        variables: {
          title, name, describtion
        },

      })
    } catch (error) {
      console.log(error);

      console.log(error.response.data);

    }
  };
  !loading && console.log(data);

  return (
    <div className="flex bg-white">
      <Head>
        <title>Create a Community</title>
      </Head>
      <div
        className="w-40 h-screen "
        style={{ backgroundImage: 'url("/images/mosaik.png")' }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-98">
          <h1 className="mb-2 text-lg font-medium">Create a Community</h1>
          <hr />
          <form onSubmit={submitForm}>
            <div className="my-6">
              <p className="font-medium">Name</p>
              <p className="mb-1 text-xs text-gray-500">
                Include Cap Letters. Name cannot be changed anymore
              </p>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={classNames(
                  'w-full p-3 border border-gray-200 rounded hover:border-gray-500',
                  { 'border-red-600': errors.name || errors.sub }
                )}
              ></input>
              <small className="font-medium text-red-600">{errors.name}</small>
            </div>
            <div className="my-6">
              <p className="font-medium">Title</p>
              <p className="mb-1 text-xs text-gray-500">
                Community Title Represent the Topic. Can change any time
              </p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={classNames(
                  'w-full p-3 border border-gray-200 rounded hover:border-gray-500',
                  { 'border-red-600': errors.title || errors.sub }
                )}
              ></input>
              <small className="font-medium text-red-600">{errors.title}</small>
            </div>
            <div className="my-6">
              <p className="font-medium">Describtion</p>
              <p className="mb-1 text-xs text-gray-500">
                Describtion of your Sub
              </p>
              <textarea
                value={describtion}
                onChange={(e) => setDescribtion(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded hover:border-gray-500"
              ></textarea>
              <small className="font-medium text-red-600">
                {errors.describtion}
              </small>
            </div>
            <small className="flex justify-end font-medium text-red-600">
              {errors.sub}
            </small>
            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-semibold capitalize blue button">
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = await req.headers.cookie;

    if (!cookie) throw new Error('Missing Auth Token Cookie');

    return { props: {} };
  } catch (error) {
    // @ts-ignore
    res.writeHead(307, { Location: '/login' }).end();
  }
};
