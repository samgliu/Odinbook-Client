import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';

function NewPost({ handleNewSelfPost, extractPost, sortPosts, posts }) {
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
            await newPostPostData();
        } else {
            console.log(state);
        }
    }
    async function newPostPostData() {
        try {
            const params = `/create-post-self`;
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
                const newPosts = [res.data, ...posts];
                handleNewSelfPost(newPosts);
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
                <h3>New Post</h3>
                {errors !== null ? (
                    <div className="error">{errors}</div>
                ) : (
                    <div></div>
                )}

                <div className="form-group">
                    <textarea
                        type="text"
                        value={state.content}
                        name="content"
                        rows="5"
                        cols="60"
                        placeholder="Enter content"
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

export default NewPost;
