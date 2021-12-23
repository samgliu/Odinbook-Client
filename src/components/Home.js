import Header from '../components/Header';
import Footer from '../components/Footer';
import Posts from '../components/Posts';
import apiClient from './http-common';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Home(props) {
    const { user, setUser, isLoggedIn, setIsLoggedIn, accessToken } =
        useContext(GlobalContext);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('bookUser'));
        if (user !== null) {
            setIsLoggedIn(true);
            setUser(user);
        } else {
            navigate('/signin');
        }
        async function getPostsData() {
            try {
                const accessHeader = {
                    headers: {
                        'x-access-token': accessToken,
                    },
                };
                const res = await apiClient.get('/', accessHeader);
                console.log(res);
                setPosts(res.data);
            } catch (err) {
                //setPosts(fortmatResponse(err.response?.data || err));
            }
        }
        if (accessToken != null) {
            getPostsData();
        }
    }, [setUser, setIsLoggedIn]);

    return (
        <div>
            <Header />
            <Posts posts={posts} />
            <Footer />
        </div>
    );
}

export default Home;
