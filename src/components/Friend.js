import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Friend({ isChatOpen, newMessagesCounter, fr, friendMessageOnClick }) {
    const { accessToken } = useContext(GlobalContext);
    const [friend, setFriend] = useState(fr);

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
