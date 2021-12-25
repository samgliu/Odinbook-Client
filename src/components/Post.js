import { Link, useNavigate } from 'react-router-dom';
//import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { useContext } from 'react';
import apiClient from './http-common';

function Post({ post, deletePostLocal }) {
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

    return (
        <div className="post-container" id={post._id}>
            <div className="author-container">
                <Link to={`/${post.Author.Username}/profile`}>
                    <h6>
                        {post.Author.Firstname} {post.Author.Lastname}
                    </h6>
                    <img src={post.Author.Avatar} alt="" />
                </Link>
                <p>{post.Timestamp.substring(0, 10)}</p>
            </div>
            <div className="post-header">
                <p className="content-preview">{post.Content}</p>
                <div>
                    <p>Likes: {post.Likes.length}</p>
                    <p>Comments: {post.Comments.length}</p>
                </div>
                <div>
                    <input></input>
                </div>
            </div>
        </div>
    );
}

export default Post;
