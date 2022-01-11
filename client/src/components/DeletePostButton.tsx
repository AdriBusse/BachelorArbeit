import { useMutation } from '@apollo/client';
import React from 'react'
import { DELETEPOST } from '../querys/mutations/deletePost';
import ActionButton from './ActionButton'

interface Props {
    subId: string;
    postId: string;
    postIdentifier: string;
}
const DeletePostButton = ({ subId, postId, postIdentifier }: Props) => {
    const [deletePostMutation, { data: deleteReturn, error: deleteError }] = useMutation(DELETEPOST, {
        update(cache) {
            cache.modify({
                id: cache.identify({ id: subId, __typename: 'Sub' }),
                fields: {
                    posts(existingPosts = []) {
                        const postToRemove = cache.identify({ id: postId, __typename: 'Post' })

                        return existingPosts.filter(post => post.__ref !== postToRemove);
                    },
                },
            });
            cache.gc()
        }
    },
    )
    const onDelete = async () => {
        if (confirm('Are you sure you want to delete this post?')) {
            await deletePostMutation({
                variables: {
                    identifier: postIdentifier,
                },
            })
        }
    }
    return (
        <div data-testid="deleteIcon" className="cursor-pointer" onClick={() => onDelete()}>
            <ActionButton >
                <i className="mr-1 fas fa-trash-alt fa-xs"></i>
                <span className="font-bold">Delete</span>
            </ActionButton>
        </div>
    )
}

export default DeletePostButton