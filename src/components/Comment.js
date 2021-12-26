import { Link, useNavigate } from 'react-router-dom';
import NewComment from './NewComment';
import CommentDropdownButton from './CommentDropdownButton';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';

function Comment({ comment, handleCommentDeleteOnClick, deleteCmtLocal }) {
    const [hasAuth, setHasAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setHasAuth(comment.isAuth);
    }, [comment.isAuth, setHasAuth]);

    async function handleDeleteOnClick() {
        await handleCommentDeleteOnClick(comment._id);
        await deleteCmtLocal(comment._id);
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
                    <CommentDropdownButton
                        handleDelete={() => handleDeleteOnClick()}
                        hasAuth={hasAuth}
                    />
                </div>
            </div>
        </div>
    );
}

export default Comment;
