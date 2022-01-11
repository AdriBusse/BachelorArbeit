import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { FormEvent, useState } from 'react';
import classNames from 'classNames';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { CREATESUB } from '../../querys/mutations/createSub';
import CreateSub from '../../pageComponents/r/subs/CreateSub';

export default function create() {

  return <CreateSub />
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
