import { Link, useNavigate } from 'react-router-dom';
import NewComment from './NewComment';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';

function Comment({ comment, deletePostLocal }) {
    const navigate = useNavigate();

    async function handleDeleteOnClick(e) {
        e.preventDefault();
        const id = e.target.parentElement.parentElement.id;
        await deleteComment(id);
        deletePostLocal(id);
    }
    async function deleteComment(id) {
        try {
            /*const params = `/${id}/delete`;
            const res = await apiClient.delete(params);
            if (res.status === 200) {
                navigate('/');
            }*/
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }

    return (
        <div className="comment-container" id={comment._id}>
            <div className="author-container">
                <Link to={`/${comment.Author.Username}/profile`}>
                    <h6>
                        {comment.Author.Firstname} {comment.Author.Lastname}
                    </h6>
                    <img src={comment.Author.Avatar} alt="" />
                </Link>
                <p>{comment.Timestamp.substring(0, 10)}</p>
                <div className="comment-detail">
                    <p>{comment.Content}</p>
                </div>
            </div>
        </div>
    );
}

export default Comment;
