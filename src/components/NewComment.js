import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
import uploadApiClient from './upload-common';

function NewComment({ comments, handleNewTargetComment, postId }) {
    const [errors, setErrors] = useState(null);
    const [state, setState] = useState({
        picture: '',
        content: '',
    });
    const [previewimg, setPreviewimg] = useState();
    const [imgblob, setImgblob] = useState(null);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);
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
            if (isUploadingPicture) {
                const picture = await onsavebtnOnclicked();
                await newCommentPostData({ ...state, picture: picture });
            } else {
                await newCommentPostData(state);
            }
        } else {
            console.log(state);
        }
    }
    async function newCommentPostData(data) {
        try {
            const params = `/${postId}/comment-create`;
            const accessHeader = {
                headers: {
                    'x-access-token': accessToken,
                },
            };
            const res = await apiClient.post(
                params,
                //JSON.stringify(state),
                data,
                accessHeader
            );

            if (res.status === 200) {
                //console.log(res.data);
                res.data.isAuth = true;
                const newComments = [...comments, res.data];
                //console.log(newComments);
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

    const onSelectChange = async (e) => {
        e.preventDefault();
        //console.log(e.target.files);
        if (e.target.files.length !== 0) {
            //console.log(e.target.files[0]);
            setPreviewimg(window.URL.createObjectURL(e.target.files[0]));
        }

        setImgblob(e.target.files[0]);
    };

    function selectbtnonClick(e) {
        setIsUploadingPicture(true);
        e.preventDefault();
        document.getElementById(`new-comment-${postId}`).click();
    }

    function cancelUploadOnClick(e) {
        e.preventDefault();
        setIsUploadingPicture(false);
    }

    async function onsavebtnOnclicked() {
        try {
            let formData = new FormData();
            formData.append('picture', imgblob);
            const params = `/upload-post`;
            const res = await uploadApiClient.post(
                params,
                formData,
                accessHeader
            );
            if (res.status === 200) {
                setIsUploadingPicture(false);
                return res.data;
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
        //await saveAvatartoserver(imgblob);
        //setIschangingavatar(false);
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
                <div>
                    <input
                        type="file"
                        id={`new-comment-${postId}`}
                        onChange={(e) => onSelectChange(e)}
                        style={{ display: 'none' }}
                    />
                    {isUploadingPicture ? (
                        <div>
                            <img
                                src={previewimg}
                                alt=""
                                onClick={(e) => selectbtnonClick(e)}
                            />
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
                {isUploadingPicture ? (
                    <button
                        type="submit"
                        onClick={(e) => cancelUploadOnClick(e)}
                    >
                        Cancel
                    </button>
                ) : (
                    <button type="submit" onClick={(e) => selectbtnonClick(e)}>
                        Select Picture
                    </button>
                )}
                <button type="submit" onClick={(e) => handleSubmitOnClick(e)}>
                    Send Comment
                </button>
            </form>
        </div>
    );
}

export default NewComment;
