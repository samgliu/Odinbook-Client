import Header from '../components/Header';
import Footer from '../components/Footer';
import Posts from '../components/Posts';
import NewPost from '../components/NewPost';
import Friends from '../components/Friends';
import apiClient from './http-common';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Home() {
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
    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };

    /*async function extractPost(data) {
        let arr = [...data.Posts];
        //console.log(data);
        data.Friends.forEach((friend) => {
            //console.log(friend);
            arr.push(...friend.Posts);
        });

        return arr;
    }*/

    async function checkIsLiked(uid, arr) {
        const yes = arr.some((item) => {
            return String(item._id) === String(uid);
        });
        return yes;
    }

    async function extractPost(data) {
        let arr = [];
        data.Posts.forEach((post) => {
            checkIsLiked(user._id, post.Likes).then((res) => {
                post.isAuth = true;
                post.isLiked = res;
                arr.push(post);
            });
        });
        data.Friends.forEach((friend) => {
            //console.log(friend);
            const tempArr = friend.Posts;
            tempArr.forEach((post) => {
                checkIsLiked(user._id, post.Likes).then((res) => {
                    post.isAuth = true;
                    post.isLiked = res;
                    arr.push(post);
                });
            });
            //arr.push(...friend.Posts);
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
    /*
    async function handleDropdownOnClick(postId) {
        const params = `/${postId}/auth`;
        const res = await apiClient.get(params, accessHeader);
        if (res.status === 200) {
            return true;
        } else {
            return false;
        }
    }
*/
    async function handleDeletePost(postId) {
        try {
            const params = `/${postId}/delete`;
            const res = await apiClient.delete(params, accessHeader);
            if (res.status === 200) {
                handleDeletePostLocal(postId);
                navigate('/');
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }
    /*
    async function handleCmtDropdownOnClick(postId, cmtId) {
        //console.log(`/${postId}/comment/${cmtId}/cmt-auth`);
        const params = `/${postId}/comment/${cmtId}/cmt-auth`;
        const res = await apiClient.get(params, accessHeader);
        //console.log(res.data);
        if (res.status === 200) {
            return true;
        } else {
            return false;
        }
    }*/

    async function handleCmtDeleteOnClick(postId, cmtId) {
        //console.log(`/${postId}/comment/${cmtId}/cmt-auth`);
        const params = `/${postId}/comment/${cmtId}/delete`;
        const res = await apiClient.delete(params, accessHeader);
        //console.log(res.data);
        if (res.status === 200) {
        } else {
            //
        }
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
                const userData = res.data;
                localStorage.setItem('bookUser', JSON.stringify(userData));
                setUser(userData);
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
            <Friends />
            <NewPost
                handleNewSelfPost={(data) => handleNewSelfPost(data)}
                extractPost={extractPost}
                sortPosts={sortPosts}
                posts={posts}
            />

            <Posts
                posts={posts}
                handleDeletePost={(id) => handleDeletePost(id)}
                handleCmtDelete={(c, p) => handleCmtDeleteOnClick(c, p)}
            />
            <Footer />
        </div>
    );
}

export default Home;
