import Post from './Post';
import apiClient from './http-common';
import { useEffect, useState } from 'react';

function Posts({ posts }) {
    useEffect(() => {}, []); // dependency
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
    //{posts.map((post) => postRender(post))}
    if (posts) {
        return <div className="posts-container"></div>;
    } else {
        return <div></div>;
    }
}

export default Posts;
