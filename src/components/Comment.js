import { Link, useNavigate } from 'react-router-dom';
import NewComment from './NewComment';
import CommentDropdownButton from './CommentDropdownButton';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';

function Comment({ comment, handleCommentDeleteOnClick, deleteCmtLocal }) {
    const [hasAuth, setHasAuth] = useState(false);
    const [likesCounter, setLikesCounter] = useState(null);
    const [isLiked, setIsLiked] = useState(null);
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);
    const navigate = useNavigate();
    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };
    const commentId = comment._id;

    useEffect(() => {
        setHasAuth(comment.isAuth);
        setIsLiked(comment.isLiked);
        setLikesCounter(comment.Likes.length);
    }, [comment.isAuth, setHasAuth]);

    async function handleDeleteOnClick() {
        await handleCommentDeleteOnClick(comment._id);
        await deleteCmtLocal(comment._id);
    }

    async function handleLikeOnClick(e) {
        e.preventDefault();
        try {
            const params = `/${commentId}/cmt-like`;
            const res = await apiClient.get(params, accessHeader);
            if (res.status === 200) {
                //console.log(res.data);
                setIsLiked(true);
                setLikesCounter(likesCounter + 1);
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }

    async function handleUnlikeOnClick(e) {
        e.preventDefault();
        try {
            const params = `/${commentId}/cmt-unlike`;
            const res = await apiClient.get(params, accessHeader);
            if (res.status === 200) {
                //console.log(res.data);
                setIsLiked(false);
                setLikesCounter(likesCounter - 1);
            }
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
                    <img
                        src={`${
                            process.env.REACT_APP_API + comment.Author.Avatar
                        }`}
                        alt=""
                    />
                </Link>
                <p>{comment.Timestamp.substring(0, 10)}</p>
                <div>
                    <p>Likes: {likesCounter}</p>
                    {isLiked ? (
                        <button onClick={(e) => handleUnlikeOnClick(e)}>
                            Unlike
                        </button>
                    ) : (
                        <button onClick={(e) => handleLikeOnClick(e)}>
                            Like
                        </button>
                    )}
                </div>

                <div className="comment-detail">
                    <div>
                        {comment.Picture ? (
                            <img
                                src={
                                    process.env.REACT_APP_API + comment.Picture
                                }
                                alt=""
                                className="picture"
                            />
                        ) : (
                            <div></div>
                        )}
                        <p>{comment.Content}</p>
                    </div>

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
