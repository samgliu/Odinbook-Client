import Post from './Post';
import Comment from './Comment';
import apiClient from './http-common';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Comments({ comments }) {
    //console.log(comments);
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);

    function deleteCommentLocal(id) {
        const newComments = comments.filter((cmt) => cmt._id !== id);
        //setPosts(newPosts);
    }
    const commentRender = (comment) => {
        //console.log(comment);
        return (
            <Comment
                comment={comment}
                key={comment._id}
                deleteCommentLocal={(id) => deleteCommentLocal(id)}
            />
        );
    };
    if (comments) {
        return (
            <div className="comments-container">
                {comments.map((comment) => commentRender(comment))}
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default Comments;
