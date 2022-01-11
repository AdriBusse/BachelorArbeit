import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import PostCard from '../../../components/PostCard';
import { useAuthState } from '../../../context/auth';
import UserPage from '../../../pageComponents/r/u/[username]/UserPage';
import { GETUSER } from '../../../querys/getUser';

import { Post, Comment } from '../../../types';

export default function user() {
  const router = useRouter();
  const { username } = router.query;


  if (username) {
    return <UserPage username={String(username)} />
  } else {
    return <div>Loading...</div>
  }


}
