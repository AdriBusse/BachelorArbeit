import { useQuery, useMutation } from '@apollo/client';
import Head from 'next/head';
import router from 'next/router';
import React, { ChangeEvent, createRef, Fragment, useEffect, useState } from 'react'
import PostCard from '../../../components/PostCard';
import Sidebar from '../../../components/Sidebar';
import { useAuthState } from '../../../context/auth';
import { GETSUB } from '../../../querys/getSub';
import { UPLOADSUBIMAGE } from '../../../querys/mutations/uploadSubImage';
import classNames from 'classNames';
import Image from 'next/image';
import { sortPosts } from '../../../utils/sortPost';
import ActionButton from '../../../components/ActionButton';
import Link from 'next/link';
import { printCache } from '../../../apollo-client';


interface Props {
    subName: string;
}

const SubPage = ({ subName }: Props) => {
    //localState
    const [ownSub, setOwnSub] = useState(false);
    //GlobalState
    const { authenticated, user } = useAuthState();
    console.log("user:", user);


    const fileInputRef = createRef<HTMLInputElement>();

    const { data: sub, loading, error } = useQuery(GETSUB, { variables: { name: subName }, skip: !subName })
    const [uploadPictureMutation, { error: errorImage, data, loading: loadingImage }] = useMutation(UPLOADSUBIMAGE, {
        onCompleted: (data) => {
            console.log(data);

        }
    })

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

        postsMarkup = sortPosts(sub.getSub.posts).map((post) => (
            <PostCard
                key={post.identifier}
                post={post}
                subId={String(sub.getSub.id)}
            ></PostCard>
        ));
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
                                        <h1 className="mb-1 mr-2 text-3xl font-bold">{sub.getSub.title}</h1>
                                        {user && sub.getSub.username === user.username && <ActionButton>
                                            <Link prefetch={false} href={`/r/${sub.getSub.name}/edit`}>
                                                <a>
                                                    <i className="mr-1 text-2xl fas fa-edit fa-xs"></i>
                                                    <span className="font-bold">Edit</span>
                                                </a>
                                            </Link>
                                        </ActionButton>}
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

export default SubPage