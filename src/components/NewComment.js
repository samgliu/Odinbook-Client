import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
import uploadApiClient from './upload-common';
import selectPicture from '../images/selectPicture.svg';

function NewComment({ comments, handleNewTargetComment, postId }) {
    const [errors, setErrors] = useState(null);
    const [state, setState] = useState({
        picture: '',
        content: '',
    });
    const [previewimg, setPreviewimg] = useState();
    const [imgblob, setImgblob] = useState(null);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);
    const { user, accessToken } = useContext(GlobalContext);

    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };

    function validator() {
        if (state.content === '') {
            setErrors('Some field is empty!');
        } else if (state.content.length > 250) {
            setErrors('Send comment within 250 characters!');
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
            //console.log(state);
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
            const res = await apiClient.post(params, data, accessHeader);

            if (res.status === 200) {
                res.data.isAuth = true;
                const newComments = [...comments, res.data];
                handleNewTargetComment(newComments);
                setState({
                    picture: '',
                    content: '',
                });
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }

    const onSelectChange = async (e) => {
        e.preventDefault();
        if (e.target.files.length !== 0) {
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
    }

    return (
        <div>
            <form className="newcomment-form-container">
                {errors !== null ? (
                    <div className="error">{errors}</div>
                ) : (
                    <div></div>
                )}

                <div className="newcomment-form-group">
                    {user ? (
                        <img
                            className="avatar"
                            src={`${process.env.REACT_APP_API + user.Avatar}`}
                            alt=""
                        />
                    ) : (
                        <div></div>
                    )}
                    <input
                        type="text"
                        value={state.content}
                        name="content"
                        placeholder="Write a comment..."
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="preview-wrapper">
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
                <div className="newpost-buttons-container">
                    {isUploadingPicture ? (
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={(e) => cancelUploadOnClick(e)}
                        >
                            Cancel
                        </button>
                    ) : (
                        <button
                            className="icon-button"
                            type="button"
                            onClick={(e) => selectbtnonClick(e)}
                        >
                            <img className="icon" src={selectPicture} alt="" />
                        </button>
                    )}
                    <button
                        className="newpost-button"
                        type="submit"
                        onClick={(e) => handleSubmitOnClick(e)}
                    >
                        Comment
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewComment;
