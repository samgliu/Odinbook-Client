import { Link, useNavigate } from 'react-router-dom';
import NewComment from './NewComment';
import PostDropdownButton from './PostDropdownButton';
//import CommentDropdownButton from './CommentDropdownButton';
import Comments from './Comments';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';

function Post({ post, handleDeletePost, handleCmtDeleteOnClick }) {
    const navigate = useNavigate();
    const [comments, setComments] = useState(null);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [hasAuth, setHasAuth] = useState(false);
    const [commentsCounter, setCommentsCounter] = useState(null);
    const [likesCounter, setLikesCounter] = useState(null);
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
    async function extractComments() {
        const localArr = [];
        async function lp() {
            const originalComments = post.Comments;
            const uid = String(user._id);
            const isPostAuth = String(user._id) === String(post.Author._id);
            originalComments.forEach((cmt) => {
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

    return (
        <div className="post-container" id={post._id}>
            <div className="author-container">
                <Link to={`/${post.Author.Username}/profile`}>
                    <h6>
                        {post.Author.Firstname} {post.Author.Lastname}
                    </h6>
                    <img src={post.Author.Avatar} alt="" />
                </Link>
                <p>{post.Timestamp.substring(0, 10)}</p>

                <PostDropdownButton
                    handleDropdownOnClick={() => handleDropdown()}
                    handleDeleteOnClick={() => handleDeleteOnClick()}
                    hasAuth={hasAuth}
                />
            </div>
            <div className="post-header">
                <p className="content-preview">{post.Content}</p>
                <div>
                    <p>Likes: {likesCounter}</p>
                    <p>Comments: {commentsCounter}</p>
                </div>
                <div>
                    <button>Like</button>
                    <button onClick={(e) => handleCommentOpenClick(e)}>
                        Comment
                    </button>
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
                <div>
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
