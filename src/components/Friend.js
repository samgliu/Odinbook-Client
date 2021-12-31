import { Link, useNavigate } from 'react-router-dom';
import NewComment from './NewComment';
import CommentDropdownButton from './CommentDropdownButton';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
import thumbIcon from '../images/thumb.svg';
const { v4: uuidv4 } = require('uuid');

function Friend({ isChatOpen, newMessagesCounter, fr, friendMessageOnClick }) {
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
        arrivalMessage,
    } = useContext(GlobalContext);
    const navigate = useNavigate();
    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };

    return (
        <li>
            <Link to={`${fr.Username}/profile`}>
                <img
                    className="avatar"
                    src={process.env.REACT_APP_API + fr.Avatar}
                    alt=""
                />
                {!isChatOpen && newMessagesCounter && newMessagesCounter > 0 ? (
                    <span className="new-message-dot">
                        <p>{newMessagesCounter}</p>
                    </span>
                ) : (
                    ''
                )}
                {fr.isOnline ? <span className="green-dot"></span> : ''}
            </Link>
            <div
                className="clickable"
                onClick={(e) =>
                    friendMessageOnClick(
                        e,
                        fr._id,
                        fr.Firstname + ' ' + fr.Lastname
                    )
                }
            >
                {fr.Firstname + ' '}
                {fr.Lastname + ' '}
            </div>
        </li>
    );
}
export default Friend;
