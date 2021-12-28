import Header from '../components/Header';
import Footer from '../components/Footer';
import Posts from '../components/Posts';
import NewPost from '../components/NewPost';
import apiClient from './http-common';
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
    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };

    const navigate = useNavigate();
    //console.log(profileData);

    async function handleEditProfileOnClick(e) {
        e.preventDefault();
        console.log('edit');
    }
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
    if (profileData) {
        return (
            <div>
                <div className="author-container">
                    <Link to={`/${profileData.Username}/profile`}>
                        <h6>
                            {profileData.Firstname} {profileData.Lastname}
                        </h6>
                        <img src={profileData.Avatar} alt="" />
                    </Link>
                </div>
                <div>
                    {isUserProfile ? (
                        <button onClick={(e) => handleEditProfileOnClick(e)}>
                            Edit Profile
                        </button>
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
