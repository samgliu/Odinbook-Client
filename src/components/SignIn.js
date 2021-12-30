import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
import logo from '../images/logo.png';

function SignIn() {
    const { setUser, setIsLoggedIn, accessToken, setAccessToken } =
        useContext(GlobalContext);
    const [errors, setErrors] = useState(null);
    const [state, setState] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    function validator() {
        //console.log(state);
        if (state.email === '' || state.password === '') {
            setErrors('Some field is empty!');
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
            await signInPostData();
        } else {
            console.log(state);
        }
    }
    async function signInPostData() {
        try {
            const url = `/signin`;
            const data = JSON.stringify(state);
            const res = apiClient.post(url, data).then((response) => {
                const userData = response.data.user;
                if (response.data.accessToken && response.data.refreshToken) {
                    const token = response.data.accessToken;
                    const refresh = response.data.refreshToken;
                    setAccessToken(token);
                    setIsLoggedIn(true);
                    setUser(userData);
                    localStorage.setItem('bookUser', JSON.stringify(userData));
                    sessionStorage.setItem('rt', refresh);
                }
                navigate('/');
            });
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }
    return (
        <div className="signup">
            <div className="signupcontainer">
                <div>
                    <img src={logo} alt="" />
                </div>
                <h1>Log In</h1>
                <form className="sigupform" method="Post">
                    {errors !== null ? (
                        <div className="error">{errors}</div>
                    ) : (
                        <div></div>
                    )}

                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={(e) => handleSubmitOnClick(e)}
                    >
                        Log In
                    </button>
                    <Link to="/signup">Create a new account</Link>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
