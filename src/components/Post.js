import { Link, useNavigate } from 'react-router-dom';
//import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { useContext } from 'react';
import apiClient from './http-common';

function Post({ post, deletePostLocal }) {
    const { isAdmin } = useContext(GlobalContext);
    const navigate = useNavigate();
    async function handleDeleteOnClick(e) {
        e.preventDefault();
        const id = e.target.parentElement.parentElement.id;
        await deletePost(id);
        deletePostLocal(id);
    }
    async function deletePost(id) {
        try {
            const params = `/${id}/delete`;
            const res = await apiClient.delete(params);
            if (res.status === 200) {
                navigate('/');
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }
    return <div>post</div>;
}

export default Post;
