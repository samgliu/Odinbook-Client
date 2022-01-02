import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import apiClient from './http-common';
import logo from '../images/logo.png';
import '../style/SignUp.css';

function SignUp() {
    const [errors, setErrors] = useState(null);
    const [state, setState] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirm: '',
    });
    const navigate = useNavigate();

    function validator() {
        if (
            state.firstname === '' ||
            state.lastname === '' ||
            state.username === '' ||
            state.email === '' ||
            state.password === '' ||
            state.confirm === ''
        ) {
            setErrors('Some field is empty!');
        } else if (state.confirm !== state.password) {
            setErrors('Password confirmation does not match!');
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
            await signUpPostData();
        } else {
            console.log(state);
        }
    }

    async function signUpPostData() {
        try {
            const url = `/signup`;
            const data = JSON.stringify(state);
            const res = await apiClient.post(url, data);
            if (res.status === 200) {
                navigate('/signin');
            }
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
                <h1>Create a new account</h1>
                <form className="sigupform">
                    {errors !== null ? (
                        <div className="error">{errors}</div>
                    ) : (
                        <div></div>
                    )}
                    <div className="form-group signup-name">
                        <div>
                            <input
                                type="text"
                                placeholder="First name"
                                name="firstname"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Last name"
                                name="lastname"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="User name"
                            name="username"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group signup-name">
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="confirm"
                                placeholder="Confirm password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        onClick={(e) => handleSubmitOnClick(e)}
                    >
                        Sign Up
                    </button>
                    <Link to="/signin">
                        Already have an account? Or choose a test account at
                        sign in page.
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
