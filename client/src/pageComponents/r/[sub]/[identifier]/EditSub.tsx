import { useQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react'
import { GETSUBFORCREATEPOST } from '../../../../querys/getSubForCreatePost';
import classNames from 'classNames';
import Head from 'next/head';
import { UPDATESUB } from '../../../../querys/mutations/updateSub';
import { useRouter } from "next/router";


interface Props {
    subName: string;
}
const EditSub = ({ subName }: Props) => {
    const router = useRouter();
    const [title, setTitle] = useState('')
    const [describtion, setDescribtion] = useState('')
    const { data: sub } = useQuery(GETSUBFORCREATEPOST, {
        variables: { name: subName }, skip: !subName, onCompleted: () => {
            setTitle(sub.getSub.title)
            setDescribtion(sub.getSub.describtion)
        }
    });

    const [updateSub, { error, data, loading: loading }] = useMutation(UPDATESUB, {
        onCompleted: (data) => {
            router.push(`/r/${subName}`);

        },
        update(cache, { data: { updateSub } }) {
            cache.modify({
                id: cache.identify(updateSub),
                fields: {
                    title: () => title,
                    describtion: () => describtion
                }
            })



        }
    })

    const submitForm = async (e) => {

        e.preventDefault();
        if (title === "" || describtion === "") {
            alert("Please fill all fields")
            return
        }
        await updateSub({
            variables: {
                name: subName,
                title,
                describtion
            }
        })

    }
    if (sub) {
        return (
            <div>

                <div className="flex bg-white">
                    <Head>
                        <title>Update a Community</title>
                    </Head>
                    <div
                        className="w-40 h-screen "
                        style={{ backgroundImage: 'url("/images/mosaik.png")' }}
                    ></div>
                    <div className="flex flex-col justify-center pl-6">
                        <div className="w-98">
                            <h1 className="mb-2 text-lg font-medium">Update {sub.name}</h1>
                            <hr />
                            <form onSubmit={(e) => submitForm(e)}>
                                <div className="my-6">
                                    <p className="font-medium">Title</p>
                                    <p className="mb-1 text-xs text-gray-500">
                                        Community Title
                                    </p>
                                    <input
                                        value={title}
                                        data-testid="titleInput"
                                        onChange={(e) => setTitle(e.target.value)}
                                        className={classNames(
                                            'w-full p-3 border border-gray-200 rounded hover:border-gray-500',

                                        )}
                                    ></input>

                                </div>
                                <div className="my-6">
                                    <p className="font-medium">Describtion</p>
                                    <p className="mb-1 text-xs text-gray-500">
                                        Describtion of your Sub
                                    </p>
                                    <textarea
                                        data-testid="describtionInput"
                                        value={describtion}
                                        onChange={(e) => setDescribtion(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded hover:border-gray-500"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end">
                                    <button data-testid="updateButton" className="px-4 py-1 text-sm font-semibold capitalize blue button">
                                        Update Community
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return <div>Loading..</div>
    }

}

export default EditSub