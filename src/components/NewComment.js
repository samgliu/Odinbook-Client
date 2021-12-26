import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';

function NewComment({ comments, handleNewTargetComment, postId }) {
    const [errors, setErrors] = useState(null);
    const [state, setState] = useState({
        picture: '',
        content: '',
    });
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);
    const navigate = useNavigate();

    function validator() {
        //console.log(state);
        if (state.content === '') {
            setErrors('Some field is empty!');
        } else {
            setErrors(null);
            return true;
        }
    }
    function handleChange(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    }
    async function handleSubmitOnClick(e) {
        e.preventDefault();
        if (validator()) {
            await newCommentPostData();
        } else {
            console.log(state);
        }
    }
    async function newCommentPostData() {
        try {
            const params = `/${postId}/comment-create`;
            const accessHeader = {
                headers: {
                    'x-access-token': accessToken,
                },
            };
            const res = await apiClient.post(
                params,
                JSON.stringify(state),
                accessHeader
            );

            if (res.status === 200) {
                console.log(res.data);
                const newComments = [...comments, res.data];
                console.log(newComments);
                handleNewTargetComment(newComments);
                setState({
                    picture: '',
                    content: '',
                });
                //navigate('/');
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }
    return (
        <div>
            <form className="newpost-form-container">
                {errors !== null ? (
                    <div className="error">{errors}</div>
                ) : (
                    <div></div>
                )}

                <div className="form-group">
                    <input
                        type="text"
                        value={state.content}
                        name="content"
                        placeholder="Comment..."
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" onClick={(e) => handleSubmitOnClick(e)}>
                    Post
                </button>
            </form>
        </div>
    );
}

export default NewComment;
