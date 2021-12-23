import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useState } from 'react';
import apiClient from './http-common';

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
        //console.log(state);
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
        <div>
            <Header />
            <form className="sign-up-form-container">
                <h3>Sign Up</h3>
                {errors !== null ? (
                    <div className="error">{errors}</div>
                ) : (
                    <div></div>
                )}

                <div className="form-group">
                    <label>First name</label>
                    <input
                        type="text"
                        placeholder="First name"
                        name="firstname"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input
                        type="text"
                        placeholder="Last name"
                        name="lastname"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>User name</label>
                    <input
                        type="text"
                        placeholder="User name"
                        name="username"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        onChange={handleChange}
                        required
                    />
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirm"
                        placeholder="Confirm password"
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" onClick={(e) => handleSubmitOnClick(e)}>
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignUp;
