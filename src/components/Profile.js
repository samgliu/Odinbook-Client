import Header from '../components/Header';
import Footer from '../components/Footer';
import Posts from '../components/Posts';
import NewTargetPost from '../components/NewTargetPost';
import ProfileDetail from '../components/ProfileDetail';
import apiClient from './http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Profile() {
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);
    const username = useParams().username;
    const [profilePost, setProfilePost] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();

    async function extractPost(data) {
        let arr = [...data.receivedPosts];
        arr.push(...data.Posts);
        return arr;
    }

    async function sortPosts(arr) {
        return arr.sort(function (a, b) {
            return Date.parse(b.Timestamp) - Date.parse(a.Timestamp);
        });
    }

    function handleNewTargetPost(newData) {
        setProfilePost(newData);
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
                const res = await apiClient
                    .get(`/${username}/profile`, accessHeader)
                    .then(async (res) => {
                        //console.log(res.data);
                        if (res.data) {
                            const posts = await extractPost(res.data);
                            const sortedPosts = await sortPosts(posts);
                            setProfilePost(sortedPosts);
                            setProfileData(res.data);
                        }
                    });
            } else {
                const refreshHeader = {
                    headers: {
                        'x-refresh-token': sessionStorage.getItem('rt'),
                    },
                };
                console.log(refreshHeader.headers['x-refresh-token']);
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
                        //navigate('/signin');
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
    }, [setUser, setIsLoggedIn, setAccessToken, accessToken]);

    /* other program ex.
    async function postCommentData(name, content) {
        try {
            console.log('postCommentData');
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }
   
    function deleteCommentLocal(cid) {
        const newComments = profileComments.filter((cmt) => cmt._id !== cid);
        setProfileComments(newComments);
    } */
    if (profileData) {
        return (
            <div>
                <Header />
                <ProfileDetail profileData={profileData} />
                <NewTargetPost
                    username={username}
                    handleNewTargetPost={(nd) => handleNewTargetPost(nd)}
                />
                <Posts posts={profilePost} />
                <Footer />
            </div>
        );
    } else {
        return (
            <div>
                <Header />
                <div>Loading</div>
                <Footer />
            </div>
        );
    }
}

export default Profile;
