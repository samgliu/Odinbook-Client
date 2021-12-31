import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect, useState } from 'react';
import apiClient from './http-common';
import logo from '../images/logo.png';
import '../style/Header.css';

function Header() {
    const { user, setUser, isLoggedIn, setIsLoggedIn, accessToken } =
        useContext(GlobalContext);
    const [isSearchOpen, setIsSearchOpen] = useState(false); //FIXME change back to false
    //let keyword = '';
    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const navigate = useNavigate();
    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };

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

    // search
    function searchOnFocus(e) {
        e.preventDefault();
        setIsSearchOpen(true);
    }
    function searchOnBlur(e) {
        e.preventDefault();
        setIsSearchOpen(false); //FIXME change back to false
    }
    async function searchOnEnter() {
        //console.log(keyword);
        if (keyword !== '') {
            let arr = await searchUserFromServer(keyword);
            //console.log(arr);
            setSearchResult(arr);
        }
    }
    async function searchUserFromServer(keyword) {
        try {
            const params = `/user-search?searchKey=${keyword}`;
            const res = await apiClient.get(params, accessHeader);
            if (res.status === 200) {
                //console.log(res.data);
                return res.data;
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }
    function navigateTo(link) {
        navigate(link);
    }

    return (
        <header>
            <Link to="/">
                <img src={logo} alt="" className="logo" />
            </Link>

            <div className="searchBox">
                <input
                    type="text"
                    placeholder="Search"
                    onFocus={(e) => searchOnFocus(e)}
                    onBlur={(e) => searchOnBlur(e)}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            e.preventDefault();
                            searchOnEnter();
                        }
                    }}
                />
                {isSearchOpen && searchResult ? (
                    <div className="searchResultWrapper">
                        <div className="searchResultWrapperHeader">Result</div>
                        <div className="searchResultContainer">
                            {searchResult.map((resUser) => (
                                <div
                                    className="resLineContainer"
                                    key={resUser._id}
                                >
                                    <div>
                                        <img
                                            className="avatar"
                                            src={
                                                process.env.REACT_APP_API +
                                                resUser.Avatar
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <Link
                                        to={{
                                            pathname: `${resUser.Username}/profile/`,
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigateTo(
                                                `${resUser.Username}/profile/`
                                            );
                                        }}
                                    >
                                        <strong>@{resUser.Username}</strong>
                                    </Link>
                                    &nbsp;&nbsp;
                                    <Link
                                        to={{
                                            pathname: `${resUser.Username}/profile/`,
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigateTo(
                                                `${resUser.Username}/profile/`
                                            );
                                        }}
                                    >
                                        <strong>
                                            {resUser.Firstname}
                                            {resUser.Lastname}
                                        </strong>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>

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
