import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';

function Header() {
    const { user, setUser, isLoggedIn, setIsLoggedIn } =
        useContext(GlobalContext);
    const navigate = useNavigate();
    async function handleLogOut(e) {
        e.preventDefault();
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('bookUser');
        await apiClient.get('/logout');
        navigate('/signin');
    }
    function handleChat(e) {
        e.preventDefault();
        console.log('Chat pressed');
    }

    return (
        <header>
            <Link to="/">
                <h1>OdinBook</h1>
            </Link>
            {isLoggedIn && user !== null ? (
                <ul>
                    <li>
                        Welcome back {user.Firstname} {user.Lastname}
                    </li>
                    <li>
                        <Link to="/" onClick={handleChat}>
                            <p>Chat</p>
                        </Link>
                    </li>

                    <li>
                        <Link to="/" onClick={handleLogOut}>
                            <p>Sign Out</p>
                        </Link>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li>
                        <Link to="/signup">
                            <p>Sign Up</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/signin">
                            <p>Sign In</p>
                        </Link>
                    </li>
                </ul>
            )}
        </header>
    );
}

export default Header;
