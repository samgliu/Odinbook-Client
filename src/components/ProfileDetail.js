import Header from '../components/Header';
import Footer from '../components/Footer';
import Posts from '../components/Posts';
import NewPost from '../components/NewPost';
import apiClient from './http-common';
import uploadApiClient from './upload-common';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function ProfileDetail({
    profileData,
    profilePostsCounter,
    isUserProfile,
    isFriend,
    handleSetIsFriend,
    profileId,
}) {
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);
    const [errors, setErrors] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [previewimg, setPreviewimg] = useState();
    const [avatar, setAvatar] = useState();
    const [ischangingavatar, setIschangingavatar] = useState(false);
    const [imgblob, setImgblob] = useState(null);
    const [state, setState] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirm: '',
    });

    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };

    const navigate = useNavigate();
    //console.log(profileData);

    function validator() {
        //console.log(state);
        if (
            state.firstname === '' ||
            state.lastname === '' ||
            state.username === '' ||
            state.email === ''
        ) {
            setErrors('Some field is empty!');
        } else if (state.confirm !== state.password) {
            setErrors('Password confirmation does not match!');
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
            await saveProfilePostData();
        } else {
            console.log(state);
        }
    }

    async function saveProfilePostData() {
        try {
            const url = `/update`;
            const data = JSON.stringify(state);
            const res = await apiClient.put(url, data, accessHeader);
            if (res.status === 200) {
                //
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }

    async function handleEditProfileOnClick(e) {
        e.preventDefault();
        setIsEditing(!isEditing);
    }
    /*
    async function handleEditAvatarOnClick(e) {
        e.preventDefault();
        console.log(e);
    }*/
    async function handleUnfriendOnClick(e) {
        e.preventDefault();
        try {
            const params = `/${profileId}/unfriend`;
            const res = await apiClient.get(params, accessHeader);
            if (res.status === 200) {
                handleSetIsFriend(false); // change local state
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }
    async function handleSendFriendOnClick(e) {
        e.preventDefault();
        try {
            const params = `/${profileId}/request-friend`;
            const res = await apiClient.get(params, accessHeader);
            if (res.status === 200) {
                //
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }

    // avatar uploading
    const onSelectChange = async (e) => {
        e.preventDefault();
        setIschangingavatar(true);
        if (e.target.files.length !== 0) {
            setPreviewimg(window.URL.createObjectURL(e.target.files[0]));
        }

        setImgblob(e.target.files[0]);
    };

    function selectbtnonClick(e) {
        e.preventDefault();
        document.getElementById('getavatarFile').click();
    }

    async function onsavebtnOnclicked(e) {
        e.preventDefault();
        try {
            let formData = new FormData();
            formData.append('picture', imgblob);
            const params = `/upload`;
            const res = await uploadApiClient.post(
                params,
                formData,
                accessHeader
            );
            if (res.status === 200) {
                setAvatar(res.data);
                setIschangingavatar(false);
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
        //await saveAvatartoserver(imgblob);
        //setIschangingavatar(false);
    }

    useEffect(() => {
        setState({
            firstname: profileData.Firstname,
            lastname: profileData.Lastname,
            username: profileData.Username,
            email: profileData.Email,
            password: '',
            confirm: '',
        });
        setAvatar(profileData.Avatar);
    }, [profileData, setAvatar]);

    if (profileData) {
        return (
            <div>
                {isEditing ? (
                    <div>
                        <form className="save-profile-form-container">
                            <h3>Profile</h3>
                            {errors !== null ? (
                                <div className="error">{errors}</div>
                            ) : (
                                <div></div>
                            )}

                            <div className="form-group">
                                <label>First name</label>
                                <input
                                    type="text"
                                    defaultValue={profileData.Firstname}
                                    name="firstname"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Last name</label>
                                <input
                                    type="text"
                                    defaultValue={profileData.Lastname}
                                    name="lastname"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>User name</label>
                                <input
                                    type="text"
                                    defaultValue={profileData.Username}
                                    name="username"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    defaultValue={profileData.Email}
                                    name="email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter new password"
                                    onChange={handleChange}
                                />
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirm"
                                    placeholder="Confirm password"
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                onClick={(e) => handleSubmitOnClick(e)}
                            >
                                Save
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="author-container">
                        <Link to={`/${profileData.Username}/profile`}>
                            <h6>
                                {profileData.Firstname} {profileData.Lastname}
                            </h6>
                        </Link>
                        <img
                            src={
                                ischangingavatar
                                    ? previewimg
                                    : `${process.env.REACT_APP_API + avatar}`
                            }
                            alt=""
                            onClick={(e) => selectbtnonClick(e)}
                        />
                        <div>
                            <input
                                type="file"
                                id="getavatarFile"
                                onChange={(e) => onSelectChange(e)}
                                style={{ display: 'none' }}
                            />
                            {ischangingavatar ? (
                                <div className="saveButton">
                                    <button
                                        onClick={(e) => onsavebtnOnclicked(e)}
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    {isUserProfile ? (
                        <div>
                            {!isEditing ? (
                                <button
                                    onClick={(e) => handleEditProfileOnClick(e)}
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => handleEditProfileOnClick(e)}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    ) : isFriend ? (
                        <button onClick={(e) => handleUnfriendOnClick(e)}>
                            Unfriend
                        </button>
                    ) : (
                        <button onClick={(e) => handleSendFriendOnClick(e)}>
                            Send friend request
                        </button>
                    )}
                </div>
                <div>
                    <p>
                        Posts:
                        {profilePostsCounter}
                    </p>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
}
export default ProfileDetail;
