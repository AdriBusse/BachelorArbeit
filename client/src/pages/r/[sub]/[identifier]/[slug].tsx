import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import { Post, Comment } from '../../../../types';
import Sidebar from '../../../../components/Sidebar';
import axios from 'axios';
import dayjs from 'dayjs';
import classNames from 'classNames';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuthState } from '../../../../context/auth';
import ActionButton from '../../../../components/ActionButton';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { COMMENTONPOST } from '../../../../querys/mutations/commentOnPost';
import { VOTE } from '../../../../querys/mutations/vote';
import { DELETEPOST } from '../../../../querys/mutations/deletePost';
import PostDetail from '../../../../pageComponents/r/[sub]/[identifier]/[slug]/PostDetail';
export default function PostPage() {

  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  if (identifier && slug) {
    return <PostDetail sub={String(sub)} identifier={String(identifier)} slug={String(slug)} />
  } else {
    return <div>Loading...</div>
  }

}
