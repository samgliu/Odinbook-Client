import { Link, useNavigate } from 'react-router-dom';
import NewComment from './NewComment';
import CommentDropdownButton from './CommentDropdownButton';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
import thumbIcon from '../images/thumb.svg';

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
            <div className="post-header-container">
                <div className="post-header-left">
                    <Link to={`/${comment.Author.Username}/profile`}>
                        <img
                            className="avatar"
                            src={`${
                                process.env.REACT_APP_API +
                                comment.Author.Avatar
                            }`}
                            alt=""
                        />
                    </Link>
                    <div>
                        <Link to={`/${comment.Author.Username}/profile`}>
                            <h6>
                                {comment.Author.Firstname}{' '}
                                {comment.Author.Lastname}
                            </h6>
                        </Link>
                        <p>
                            {new Date(comment.Timestamp)
                                .toDateString()
                                .substring(4, 15)}
                        </p>
                    </div>
                </div>
                <div className="post-header-right">
                    <CommentDropdownButton
                        handleDelete={() => handleDeleteOnClick()}
                        hasAuth={hasAuth}
                    />
                </div>
            </div>
            <div className="comment-detail">
                <div>
                    {comment.Picture ? (
                        <img
                            src={process.env.REACT_APP_API + comment.Picture}
                            alt=""
                            className="picture"
                        />
                    ) : (
                        <div></div>
                    )}
                    <div className="comment-text-container">
                        {comment.Content}
                        <span className="comment-like-icon-container">
                            <div className="like-in-comments-counter">
                                {isLiked ? (
                                    <button
                                        onClick={(e) => handleUnlikeOnClick(e)}
                                    >
                                        <img
                                            src={thumbIcon}
                                            alt=""
                                            className="blue-background"
                                        />
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => handleLikeOnClick(e)}
                                    >
                                        {' '}
                                        <img
                                            src={thumbIcon}
                                            alt=""
                                            className="gray-background"
                                        />
                                    </button>
                                )}
                                <p>{likesCounter}</p>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;
