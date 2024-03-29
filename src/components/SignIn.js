import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';

import { GlobalContext } from '../context/GlobalState';
import apiClient from './http-common';
import logo from '../images/logo.png';

function SignIn() {
  const { setUser, setIsLoggedIn, setAccessToken } = useContext(GlobalContext);
  const [errors, setErrors] = useState(null);
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  function validator() {
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
      await signInPostData(state);
    } else {
      console.log(state);
    }
  }
  async function signInPostData(theState) {
    try {
      const url = `/signin`;
      const data = JSON.stringify(theState);
      const res = apiClient
        .post(url, data)
        .then((response) => {
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
        })
        .catch((err) => {
          if (err?.response?.data?.msg) setErrors('Invalid username or password!');
          else setErrors('Internal Server Error or Network Error!');
        });
    } catch (err) {
      console.log('out err', err);
      //setPosts(fortmatResponse(err.response?.data || err));
    }
  }
  async function handleTestOnClick(e) {
    e.preventDefault();
    await signInPostData({ email: 'test2@test2.com', password: '123456' }); // test account
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

          <button type="submit" onClick={(e) => handleSubmitOnClick(e)}>
            Log In
          </button>
          <button onClick={(e) => handleTestOnClick(e)}>
            Test Account Log In
          </button>
          <p>Test Account: test1@test1.com:123456</p>
          <Link to="/signup">Create a new account</Link>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
