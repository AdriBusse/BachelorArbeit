import Head from 'next/head';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostCard from '../components/PostCard';
import Image from 'next/image';
import { Post, Sub } from '../types';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthState } from '../context/auth';
import { GETTOPSUBS } from '../querys/getTopSubs';
import { useQuery } from '@apollo/client';
import { GETPOSTS } from '../querys/getPosts';
import useRequestTime from '../hooks/useRequestTime';

dayjs.extend(relativeTime);

export default function Home() {
  //const [posts, setPosts] = useState<Post[]>([]);
  const { data: topSubs } = useQuery(GETTOPSUBS)



  //const { data: posts } = useSWR<Post[]>('/posts');
  const [observedPost, setObservedPost] = useState('');
  const [page, setPage] = useState(0);
  const { authenticated, user } = useAuthState();
  console.log("user", user);

  const [start, finnish] = useRequestTime()

  const describtion =
    'Reddit is a network of communities based on peoples interesst. Find communities you are interessted in, and become part of an online community';
  const title = 'Frontpage of the Internet';

  const { error, loading, data, fetchMore } = useQuery(GETPOSTS, {
    variables: {
      postPerPage: 5,
      currentPage: page
    },
  });

  !loading && console.log('getPOSTS', data);



  const posts: Post[] = data ? [].concat(...data.getPosts) : [];
  const isInitialLoading = loading

  useEffect(() => {

    if (!posts || posts.length === 0) return;

    const id = posts[posts.length - 1].identifier;
    if (id != observedPost) {
      setObservedPost(id);
      observedElement(document.getElementById(id));
    }
  }, [posts]);

  const observedElement = (element: HTMLElement) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('reached bottom of post');
          setPage(page + 1);
          start()
          await fetchMore({ variables: { currentPage: page + 1 } })

          finnish()

          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };
  // useEffect(() => {
  //   axios
  //     .get('/posts')
  //     .then((res) => setPosts(res.data))
  //     .catch((err) => console.log(err));
  // }, []);
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="describtion" content={describtion}></meta>
        <meta property="og:describtion" content={describtion}></meta>
        <meta property="og:title" content={title}></meta>
        <meta property="twitter:title" content={title}></meta>
        <meta property="twitter:describtion" content={describtion}></meta>
      </Head>
      <div className="container flex justify-center pt-4">
        <div className="w-full md:w-160">
          {isInitialLoading && (
            <p className="text-lg text-venter">Loading...</p>
          )}
          {posts?.map((post) => (
            <PostCard
              post={post}
              key={post.identifier}
            ></PostCard>
          ))}
          {loading && posts.length > 0 && (
            <p className="text-lg text-venter">Loading more Posts...</p>
          )}
        </div>
        <div>

          {/**Sidebar */}
          <div className="hidden ml-6 w-80 lg:block">
            <div className="bg-white rounded">
              <div className="p-4 bg-blue-200 border-b-2">
                <p className="text-lg font-semibold text-center">
                  Top Communities
                </p>
              </div>
              <div>
                {topSubs && topSubs.topSubs?.map((sub: Sub) => {
                  return (
                    <div
                      key={sub.name}
                      className="flex items-center px-4 py-2 text-xs border-b"
                    >
                      <Link href={`/r/${sub.name}`}>
                        <a className=" hover:cursor-pointer">
                          <Image
                            className="overflow-hidden rounded-full "
                            src={sub.imageUrl}
                            alt="Sub"
                            width={(7 * 16) / 4}
                            height={(7 * 16) / 4}
                          />
                        </a>
                      </Link>

                      <Link href={`/r/${sub.name}`}>
                        <a className="ml-1 font-bold hover:cursor-pointer">
                          /r/{sub.name}
                        </a>
                      </Link>
                      <p className="ml-auto font-med">{sub.postCount}</p>
                    </div>
                  )
                })}
              </div>
              {authenticated && (
                <div className="p-4 border-t-2">
                  <Link href="/subs/create">
                    <a href="" className="w-full px-1 py-1 blue button">
                      Create Comunity
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/**My Comunities */}
          {authenticated && <div className="hidden mt-2 ml-6 w-80 lg:block">
            <div className="bg-white rounded">
              <div className="p-4 bg-red-200 border-b-2">
                <p className="text-lg font-semibold text-center">
                  My Communities
                </p>
              </div>
              <div>
                {user && user.followedSubs?.map((sub: Sub, i) => {
                  if (i > 5) { return null }

                  return (
                    <div
                      key={sub.name}
                      className="flex items-center px-4 py-2 text-xs border-b"
                    >
                      <Link href={`/r/${sub.name}`}>
                        <a className=" hover:cursor-pointer">
                          <Image
                            className="overflow-hidden rounded-full "
                            src={sub.imageUrl}
                            alt="Sub"
                            width={(7 * 16) / 4}
                            height={(7 * 16) / 4}
                          />
                        </a>
                      </Link>

                      <Link href={`/r/${sub.name}`}>
                        <a className="ml-1 font-bold hover:cursor-pointer">
                          /r/{sub.name}
                        </a>
                      </Link>
                      <p className="ml-auto font-med">{sub.postCount}</p>
                    </div>
                  )
                })}
              </div>
              <div className="p-4 border-t-2">
                <Link href="/u/subs">
                  <a href="" className="w-full px-1 py-1 blue button">
                    View all my Comunities
                  </a>
                </Link>
              </div>

            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

// serverside rendering. useEffect is clientside rendering
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     //on server so no localhost needed
//     const res = await axios.get('/posts');

//     return { props: { posts: res.data } };
//   } catch (error) {
//     return { props: { error: 'Something went wrong' } };
//   }
// };
