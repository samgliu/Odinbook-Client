import Header from '../components/Header';
import Footer from '../components/Footer';
import Posts from '../components/Posts';
import NewPost from '../components/NewPost';
import apiClient from './http-common';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function ProfileDetail({ profileData }) {
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);

    const navigate = useNavigate();
    console.log(profileData);
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
                    <p>Posts:{profileData.Posts.length}</p>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
}
export default ProfileDetail;
