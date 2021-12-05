import Head from 'next/head';
import { useRouter } from 'next/router';
import React, {
  Fragment,
  createRef,
  useState,
  useEffect,
  ChangeEvent,
} from 'react';
import PostCard from '../../components/PostCard';
import { Sub } from '../../types';
import Image from 'next/image';
import { useAuthState } from '../../context/auth';
import classNames from 'classNames';
import Sidebar from '../../components/Sidebar';
import { GETSUB } from '../../querys/getSub';
import { useMutation, useQuery } from '@apollo/client';
import { UPLOADSUBIMAGE } from '../../querys/mutations/uploadSubImage';

export default function SubPage() {
  //localState
  const [ownSub, setOwnSub] = useState(false);
  //GlobalState
  const { authenticated, user } = useAuthState();
  //utils
  const router = useRouter();
  const fileInputRef = createRef<HTMLInputElement>();
  const subName = router.query["sub"];



  const { data: sub, loading, error } = useQuery(GETSUB, { variables: { name: subName }, skip: !subName })
  const [uploadPictureMutation, { error: errorImage, data, loading: loadingImage }] = useMutation(UPLOADSUBIMAGE, {
    onCompleted: (data) => {
      console.log(data);

    }
  })
  console.log(sub);

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.getSub.username);
  }, [sub]);
  if (error) router.push('/');
  const openFileInput = async (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;

    fileInputRef.current.click();

  };
  console.log(JSON.stringify(errorImage));

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInputRef.current.name);

    try {

      uploadPictureMutation({
        variables: {
          name: sub.getSub.name,
          location: fileInputRef.current.name,
          picture: file

        }, refetchQueries: [GETSUB]
      })

    } catch (error) {
      //console.log(JSON.stringify(error));
    }
  };
  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className="text-lg text-center">Loading...</p>;
  } else if (sub.getSub.posts.length === 0) {
    postsMarkup = (
      <p className="text-lg text-center">
        No posts Submitted to this channel...
      </p>
    );
  } else {
    postsMarkup = sub.getSub.posts.map((post) => (
      <PostCard
        key={post.identifier}
        post={post}
      ></PostCard>
    ));
  }
  if (!subName) {
    return <></>
  }
  return (
    <div>
      <div>
        <Head>
          <title>{sub?.getSub.title}</title>
        </Head>
      </div>

      {sub && (
        <Fragment>
          <input
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={uploadImage}
          />
          {/*Subinfo and images */}
          <div>
            {/**Banner Image */}
            <div
              className={classNames('bg-blue-500', {
                'cursor-pointer': ownSub,
              })}
              onClick={() => openFileInput('banner')}
            >
              {sub.getSub.bannerUrl ? (
                <div
                  className="h-56 bg-blue-500"
                  style={{
                    backgroundImage: `url(${sub.getSub.bannerUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
            {/**Sub MetaData */}
            <div className="h-20 bg-white">
              <div className="container flex pt-1">
                {console.log(sub.getSub.imageUrl)}
                <Image
                  src={sub.getSub.imageUrl}
                  alt="Sub"
                  className={classNames('rounded-full ', {
                    'cursor-pointer': ownSub,
                  })}
                  height={70}
                  width={70}
                  onClick={() => openFileInput('image')}
                />

                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.getSub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-500">
                    /r/{sub.getSub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/*Posts and sidebar */}

          <div className="container flex justify-center pt-5">
            <div className="w-160">{postsMarkup}</div>
            <Sidebar sub={sub.getSub} />
          </div>
        </Fragment>
      )}
    </div>
  );
}
