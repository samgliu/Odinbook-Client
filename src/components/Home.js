import Header from '../components/Header';
import Footer from '../components/Footer';
import Posts from '../components/Posts';
import NewPost from '../components/NewPost';
import apiClient from './http-common';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Home(props) {
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    async function extractPost(data) {
        let arr = [...data.Posts];
        //console.log(data);
        data.Friends.forEach((friend) => {
            //console.log(friend);
            arr.push(...friend.Posts);
        });

        return arr;
    }

    async function sortPosts(arr) {
        return arr.sort(function (a, b) {
            return Date.parse(b.Timestamp) - Date.parse(a.Timestamp);
        });
    }

    function handleNewSelfPost(newData) {
        setPosts(newData);
    }

    function handleDeletePostLocal(id) {
        const newPosts = posts.filter((post) => post._id !== id);
        setPosts(newPosts);
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('bookUser'));
        async function getPostsData() {
            if (accessToken != null) {
                const accessHeader = {
                    headers: {
                        'x-access-token': accessToken,
                    },
                };
                const res = await apiClient.get('/posts', accessHeader);
                //console.log(res);
                const posts = await extractPost(res.data);
                const sortedPosts = await sortPosts(posts);
                setPosts(sortedPosts);
            } else {
                const refreshHeader = {
                    headers: {
                        'x-refresh-token': sessionStorage.getItem('rt'),
                    },
                };
                //console.log(refreshHeader.headers['x-refresh-token']);
                apiClient
                    .get('/refreshNewAccessToken', refreshHeader)
                    .then((response) => {
                        if (response) {
                            const token = response.data.accessToken;
                            if (response.data.accessToken) {
                                setAccessToken(token);
                            }
                        }
                    })
                    .catch((error) => {
                        //console.clear(); // clear 401
                        setIsLoggedIn(false);
                        navigate('/signin');
                    });
            }
        }

        if (user !== null) {
            //console.log('user is not null');
            setIsLoggedIn(true);
            setUser(user);
            getPostsData();
        } else {
            navigate('/signin');
        }
    }, [setUser, setIsLoggedIn, accessToken]);

    return (
        <div>
            <Header />
            <NewPost
                handleNewSelfPost={(data) => handleNewSelfPost(data)}
                extractPost={extractPost}
                sortPosts={sortPosts}
                posts={posts}
            />
            <Posts
                posts={posts}
                handleDeletePostLocal={(id) => handleDeletePostLocal(id)}
            />
            <Footer />
        </div>
    );
}

export default Home;
