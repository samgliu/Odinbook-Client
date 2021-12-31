import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
import '../style/Friends.css';
const { v4: uuidv4 } = require('uuid');

function Friends({ handleFriendMessageOnClick, onlineUsers }) {
    const [friendRequestList, setFriendRequestList] = useState(null);
    const [friendList, setFriendList] = useState(null);
    const [onlineCounter, setOnlineCounter] = useState(null);
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

    useEffect(() => {
        if (user && user.FriendRequests) {
            setFriendRequestList(user.FriendRequests);
        }
        if (user && user.Friends) {
            setFriendList(user.Friends);
        }

        async function checkOnlineUsers() {
            let online = 0;
            friendList.forEach((friend) => {
                onlineUsers.forEach((user) => {
                    //console.log(String(friend._id));
                    //console.log(String(user.userId));
                    if (String(friend._id) === String(user.userId)) {
                        friend.isOnline = true;
                        online = online + 1;
                    }
                });
            });
            setOnlineCounter(online);
        }
        if (friendList && onlineUsers) {
            checkOnlineUsers();
        }
        //return () => setOnlineCounter(0);
    }, [
        user,
        friendList,
        onlineUsers.length,
        setFriendRequestList,
        setFriendList,
        setOnlineCounter,
    ]);

    function handleDeleteRequestLocal(tid) {
        const newList = friendRequestList.filter(
            (friend) => friend._id !== tid
        );
        setFriendRequestList(newList);
    }

    function handleAddFriendLocal(newFriendData) {
        const newList = [...friendList, newFriendData];
        setFriendList(newList);
    }

    async function handleAcceptFriend(e, tid) {
        e.preventDefault();
        try {
            const params = `/${tid}/accept-friend`;
            const res = await apiClient.get(params, accessHeader);
            if (res.status === 200) {
                handleDeleteRequestLocal(tid);
                handleAddFriendLocal(res.data.user); // add friend locally
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }

    async function handleRejectFriend(e, tid) {
        e.preventDefault();
        try {
            const params = `/${tid}/reject-friend`;
            const res = await apiClient.get(params, accessHeader);
            if (res.status === 200) {
                handleDeleteRequestLocal(tid);
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }

    async function friendMessageOnClick(e, tid, fullname) {
        e.preventDefault();
        handleFriendMessageOnClick(tid, fullname);
    }

    useEffect(() => {
        async function markNewMessageOnFriends(tid) {
            let online = 0;
            friendList.forEach((friend) => {
                if (String(friend._id) === tid) {
                    console.log(friend);
                }
            });
            setOnlineCounter(online);
        }
        if (arrivalMessage && arrivalMessage.receiverId) {
            markNewMessageOnFriends(arrivalMessage.receiverId);
        }
    }, [arrivalMessage]);

    return (
        <div>
            {user && friendRequestList && friendRequestList.length > 0 ? (
                <div className="friends-container">
                    <h2>New Friends</h2>
                    <ul className="friends-list">
                        {friendRequestList.map((fr) => {
                            return (
                                <li key={uuidv4()}>
                                    <Link to={`${fr.Username}/profile`}>
                                        <img
                                            className="avatar"
                                            src={
                                                process.env.REACT_APP_API +
                                                fr.Avatar
                                            }
                                            alt=""
                                        />
                                    </Link>
                                    <Link to={`${fr.Username}/profile`}>
                                        {fr.Firstname + ' '}
                                        {fr.Lastname + ' '}
                                    </Link>
                                    <div>
                                        {/*FIXME add link or params to accept*/}
                                        <span
                                            onClick={(e) =>
                                                handleAcceptFriend(e, fr._id)
                                            }
                                            className="clickable blue"
                                        >
                                            Accept{'  '}
                                        </span>
                                        <span
                                            onClick={(e) =>
                                                handleRejectFriend(e, fr._id)
                                            }
                                            className="clickable blue"
                                        >
                                            Reject
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <div></div>
            )}

            <div>
                {user && friendList && friendList.length > 0 ? (
                    <div className="friends-container">
                        <h2>
                            Contacts
                            {onlineCounter ? ` (online: ${onlineCounter})` : ''}
                        </h2>
                        <ul className="friends-list">
                            {friendList.map((fr) => {
                                return (
                                    <li key={uuidv4()}>
                                        <Link to={`${fr.Username}/profile`}>
                                            <img
                                                className="avatar"
                                                src={
                                                    process.env.REACT_APP_API +
                                                    fr.Avatar
                                                }
                                                alt=""
                                            />
                                            {fr.isOnline ? (
                                                <span className="green-dot"></span>
                                            ) : (
                                                ''
                                            )}
                                        </Link>
                                        <div
                                            className="clickable"
                                            onClick={(e) =>
                                                friendMessageOnClick(
                                                    e,
                                                    fr._id,
                                                    fr.Firstname +
                                                        ' ' +
                                                        fr.Lastname
                                                )
                                            }
                                        >
                                            {fr.Firstname + ' '}
                                            {fr.Lastname + ' '}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}

export default Friends;
