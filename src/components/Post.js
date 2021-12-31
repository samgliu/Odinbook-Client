import { Link, useNavigate } from 'react-router-dom';
import NewComment from './NewComment';
import PostDropdownButton from './PostDropdownButton';
//import CommentDropdownButton from './CommentDropdownButton';
import Comments from './Comments';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
import thumbIcon from '../images/thumb.svg';
import commentIcon from '../images/comment.svg';

function Post({ post, handleDeletePost, handleCmtDeleteOnClick }) {
    const navigate = useNavigate();
    const [comments, setComments] = useState(null);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [hasAuth, setHasAuth] = useState(false);
    const [commentsCounter, setCommentsCounter] = useState(null);
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
    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };
    const postId = post._id;

    async function checkIsLiked(uid, arr) {
        const yes = arr.some((item) => {
            return String(item._id) === String(uid);
        });
        return yes;
    }

    async function extractComments() {
        const localArr = [];
        async function lp() {
            const originalComments = post.Comments;
            const uid = String(user._id);
            const isPostAuth = String(user._id) === String(post.Author._id);
            originalComments.forEach(async (cmt) => {
                checkIsLiked(uid, cmt.Likes).then((res) => {
                    cmt.isLiked = res;
                });

                if (String(user._id) === String(cmt.Author._id)) {
                    cmt.isAuth = true;
                } else {
                    cmt.isAuth = isPostAuth;
                }
                localArr.push(cmt);
            });
        }
        await lp();
        return localArr;
    }

    useEffect(() => {
        extractComments(post.Comments).then((cmts) => setComments(cmts));
        setIsLiked(post.isLiked);
        setCommentsCounter(post.Comments.length);
        setLikesCounter(post.Likes.length);
    }, [setComments]);

    async function handleDropdown() {
        setHasAuth(post.isAuth);
    }
    async function handleNewTargetComment(newData) {
        setComments(newData);
        setCommentsCounter(commentsCounter + 1);
    }

    function handleDeleteCommentLocal(id) {
        const newComments = comments.filter((cmt) => cmt._id !== id);
        setCommentsCounter(commentsCounter - 1);
        setComments(newComments);
    }

    async function handleCommentOpenClick(e) {
        e.preventDefault();
        setIsCommentOpen(!isCommentOpen);
    }
    async function handleDeleteOnClick() {
        handleDeletePost(post._id);
    }

    async function cmtDeleteOnClick(cid) {
        await handleCmtDeleteOnClick(post._id, cid);
    }

    async function handleLikeOnClick(e) {
        e.preventDefault();
        try {
            const params = `/${postId}/like`;
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
            const params = `/${postId}/unlike`;
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
        <div className="post-container" id={post._id}>
            <div className="post-header-container">
                <div className="post-header-left">
                    <Link to={`/${post.Author.Username}/profile`}>
                        <img
                            className="avatar"
                            src={`${
                                process.env.REACT_APP_API + post.Author.Avatar
                            }`}
                            alt=""
                        />
                    </Link>
                    <div>
                        <Link to={`/${post.Author.Username}/profile`}>
                            <h6>
                                {post.Author.Firstname} {post.Author.Lastname}
                            </h6>
                        </Link>
                        <p>
                            {new Date(post.Timestamp)
                                .toDateString()
                                .substring(4, 10)}
                        </p>
                    </div>
                </div>
                <div className="post-header-right">
                    <PostDropdownButton
                        handleDropdownOnClick={() => handleDropdown()}
                        handleDeleteOnClick={() => handleDeleteOnClick()}
                        hasAuth={hasAuth}
                    />
                </div>
            </div>
            <div className="post-container">
                <div className="post-image-container">
                    {post.Picture ? (
                        <img
                            src={process.env.REACT_APP_API + post.Picture}
                            alt=""
                            className="picture"
                        />
                    ) : (
                        <div></div>
                    )}
                </div>
                <p className="content-preview">{post.Content}</p>
                <div className="like-comment-counter">
                    <div>
                        {isLiked ? (
                            <button onClick={(e) => handleUnlikeOnClick(e)}>
                                <img
                                    src={thumbIcon}
                                    alt=""
                                    className="blue-background"
                                />
                            </button>
                        ) : (
                            <button onClick={(e) => handleLikeOnClick(e)}>
                                <img
                                    src={thumbIcon}
                                    alt=""
                                    className="gray-background"
                                />
                            </button>
                        )}
                        <p> {likesCounter}</p>
                    </div>
                    <div>
                        <button onClick={(e) => handleCommentOpenClick(e)}>
                            <img src={commentIcon} alt="" />
                        </button>
                        <p
                            className="clickable"
                            onClick={(e) => handleCommentOpenClick(e)}
                        >
                            {commentsCounter}
                        </p>
                    </div>
                </div>

                {isCommentOpen ? (
                    <Comments
                        comments={comments}
                        handleCommentDeleteOnClick={(c) => cmtDeleteOnClick(c)}
                        handleCmtDeleteOnClickLocal={(c) =>
                            handleDeleteCommentLocal(c)
                        }
                    />
                ) : (
                    <div></div>
                )}
                <div className="newComment-container">
                    <NewComment
                        handleNewTargetComment={(nc) =>
                            handleNewTargetComment(nc)
                        }
                        comments={comments}
                        postId={post._id}
                    />
                </div>
            </div>
        </div>
    );
}

export default Post;
