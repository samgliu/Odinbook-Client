import Post from './Post';
import apiClient from './http-common';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Posts({
    posts,
    handleDeletePost,
    handleDropdownOnClick,
    handleCmtDropdown,
    handleCmtDelete,
}) {
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);
    async function localHandleCmtDropdown(c, p) {
        return await handleCmtDropdown(c, p);
    }
    async function localHandleCmtDelete(c, p) {
        handleCmtDelete(c, p);
    }
    const postRender = (post) => {
        return (
            <Post
                post={post}
                key={post._id}
                handleDeletePost={(id) => handleDeletePost(id)}
                handleDropdownOnClick={(postId) =>
                    handleDropdownOnClick(postId)
                }
                handleCmtDropdownOnClick={(c, p) =>
                    localHandleCmtDropdown(c, p)
                }
                handleCmtDeleteOnClick={(c, p) => localHandleCmtDelete(c, p)}
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
