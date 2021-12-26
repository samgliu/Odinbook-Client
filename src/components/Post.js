import { Link, useNavigate } from 'react-router-dom';
import NewComment from './NewComment';
import PostDropdownButton from './PostDropdownButton';
import Comments from './Comments';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';

function Post({ post, deletePostLocal }) {
    const navigate = useNavigate();
    const [comments, setComments] = useState(null);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [hasAuth, setHasAuth] = useState(false);
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

    useEffect(() => {
        setComments(post.Comments);
    }, [setComments]);

    async function handleNewTargetComment(newData) {
        setComments(newData);
    }
    async function handleCommentOpenClick(e) {
        e.preventDefault();
        setIsCommentOpen(!isCommentOpen);
    }
    async function handleDeleteOnClick() {
        await deletePost(post._id);
        deletePostLocal(post._id);
    }

    async function handleDropdownOnClick() {
        const params = `/${post._id}/auth`;
        const res = await apiClient.get(params, accessHeader);
        if (res.status === 200) {
            setHasAuth(true);
        }
    }
    async function deletePost(id) {
        try {
            const params = `/${id}/delete`;
            const res = await apiClient.delete(params, accessHeader);
            if (res.status === 200) {
                navigate('/');
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
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
                    handleDropdownOnClick={handleDropdownOnClick}
                    handleDeleteOnClick={() => handleDeleteOnClick()}
                    hasAuth={hasAuth}
                />
            </div>
            <div className="post-header">
                <p className="content-preview">{post.Content}</p>
                <div>
                    <p>Likes: {post.Likes.length}</p>
                    <p>Comments: {post.Comments.length}</p>
                </div>
                <div>
                    <button>Like</button>
                    <button onClick={(e) => handleCommentOpenClick(e)}>
                        Comment
                    </button>
                </div>
                {isCommentOpen ? <Comments comments={comments} /> : <div></div>}
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
