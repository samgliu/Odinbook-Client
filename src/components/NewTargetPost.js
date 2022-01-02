import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
import uploadApiClient from './upload-common';
import selectPicture from '../images/selectPicture.svg';

function NewTargetPost({ profilePost, username, handleNewTargetPost }) {
    const [errors, setErrors] = useState(null);
    const [state, setState] = useState({
        picture: '',
        content: '',
    });
    const [previewimg, setPreviewimg] = useState();
    const [imgblob, setImgblob] = useState(null);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);

    const { accessToken } = useContext(GlobalContext);
    const navigate = useNavigate();

    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };

    function validator() {
        if (state.content === '') {
            setErrors('Some field is empty!');
        } else if (state.content.length > 1000) {
            setErrors('Send post within 1000 characters!');
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
                await newPostPostData({ ...state, picture: picture });
            } else {
                await newPostPostData(state);
            }
        } else {
            console.log(state);
        }
    }
    async function newPostPostData(data) {
        try {
            const params = `/${username}/create-post`;
            const accessHeader = {
                headers: {
                    'x-access-token': accessToken,
                },
            };
            const res = await apiClient.post(params, data, accessHeader);

            if (res.status === 200) {
                res.data.isAuth = true;
                const newPosts = [res.data, ...profilePost];
                handleNewTargetPost(newPosts);
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
        if (e.target.files.length !== 0) {
            setPreviewimg(window.URL.createObjectURL(e.target.files[0]));
        }

        setImgblob(e.target.files[0]);
    };

    function selectbtnonClick(e) {
        setIsUploadingPicture(true);
        e.preventDefault();
        document.getElementById('getPostPictureFile').click();
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
        <div className="create-post-container">
            <form className="newpost-form-container">
                <h3>Create New Post</h3>
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
                        placeholder="Enter content"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="preview-wrapper">
                    <input
                        type="file"
                        id="getPostPictureFile"
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
                            className="cancel-button"
                            type="submit"
                            onClick={(e) => cancelUploadOnClick(e)}
                        >
                            Cancel
                        </button>
                    ) : (
                        <button
                            className="icon-button"
                            type="submit"
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
                        Send Post
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewTargetPost;
