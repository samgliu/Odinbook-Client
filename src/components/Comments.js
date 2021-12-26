import Post from './Post';
import Comment from './Comment';
import apiClient from './http-common';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Comments({
    comments,
    handleCmtDropdownOnClick,
    handleCommentDeleteOnClick,
    handleCmtDeleteOnClickLocal,
}) {
    //console.log(comments);
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);
    async function cmtDropdownOnClick(cid) {
        return await handleCmtDropdownOnClick(cid);
    }
    async function cmtDeleteOnClick(cid) {
        await handleCommentDeleteOnClick(cid);
    }
    async function deleteCommentLocal(id) {
        await handleCmtDeleteOnClickLocal(id);
    }
    const commentRender = (comment) => {
        //console.log(comment);
        return (
            <Comment
                comment={comment}
                key={comment._id}
                handleCommentDropdownOnClick={(cid) => cmtDropdownOnClick(cid)}
                handleCommentDeleteOnClick={(cid) => cmtDeleteOnClick(cid)}
                deleteCmtLocal={(id) => deleteCommentLocal(id)}
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
