import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
import logo from '../images/logo.png';
import '../style/Header.css';

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
                <img src={logo} alt="" className="logo" />
            </Link>
            <input className="searchBox" type="text" placeholder="Search" />
            {isLoggedIn && user !== null ? (
                <ul>
                    <li className="header-cell">
                        <Link
                            to={{
                                pathname: `/${user.Username}/profile`,

                                state: { fromDashboard: false },
                            }}
                        >
                            <img
                                src={process.env.REACT_APP_API + user.Avatar}
                                alt=""
                                className="avatar"
                            />
                        </Link>
                    </li>
                    <li className="header-cell">
                        <Link
                            to={{
                                pathname: `/${user.Username}/profile`,

                                state: { fromDashboard: false },
                            }}
                        >
                            {user.Firstname}
                        </Link>
                    </li>

                    <li className="header-cell">
                        <Link to="/" onClick={handleLogOut}>
                            <p>Sign Out</p>
                        </Link>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li className="header-cell">
                        <Link to="/signup">
                            <p>Sign Up</p>
                        </Link>
                    </li>
                    <li className="header-cell">
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
