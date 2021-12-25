import Post from './Post';
import apiClient from './http-common';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Posts({ posts }) {
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);

    function deletePostLocal(id) {
        const newPosts = posts.filter((post) => post._id !== id);
        //setPosts(newPosts);
    }
    const postRender = (post) => {
        return (
            <Post
                post={post}
                key={post._id}
                deletePostLocal={(id) => deletePostLocal(id)}
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
