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
    const [friend, setFriend] = useState(fr);
    const navigate = useNavigate();
    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };

    useEffect(() => {
        setFriend(Object.assign({}, fr));
    }, [fr.newMessages]);

    return (
        <li>
            <Link to={`${friend.Username}/profile`}>
                <img
                    className="avatar"
                    src={process.env.REACT_APP_API + friend.Avatar}
                    alt=""
                />
                {!isChatOpen && friend.newMessages && friend.newMessages > 0 ? (
                    <span className="new-message-dot">
                        <p>{friend.newMessages}</p>
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
                        friend._id,
                        friend.Firstname + ' ' + fr.Lastname
                    )
                }
            >
                {friend.Firstname + ' '}
                {friend.Lastname + ' '}
            </div>
        </li>
    );
}
export default Friend;
