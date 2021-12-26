import Post from './Post';
import apiClient from './http-common';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Posts({ posts, handleDeletePostLocal }) {
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);

    const postRender = (post) => {
        return (
            <Post
                post={post}
                key={post._id}
                deletePostLocal={(id) => handleDeletePostLocal(id)}
            />
        );
    };
    if (posts) {
        return (
            <div className="posts-container">
                {posts.map((post) => postRender(post))}
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default Posts;
