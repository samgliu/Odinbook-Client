import Header from '../components/Header';
import Footer from '../components/Footer';
import Posts from '../components/Posts';
import NewTargetPost from '../components/NewTargetPost';
import ProfileDetail from '../components/ProfileDetail';
import apiClient from './http-common';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';

function Profile(props) {
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
        checkIsInArray,
    } = useContext(GlobalContext);

    const { username } = useParams(); // dynamic fetch data usage!
    const [profilePost, setProfilePost] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const [isUserProfile, setIsUserProfile] = useState(false);
    const [profilePostsCounter, setProfilePostsCounter] = useState(null);

    const navigate = useNavigate();
    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };

    async function checkIsInFriend(uid, arr) {
        if (arr) {
            const res = arr.some((item) => {
                return String(item._id) === String(uid);
            });
            return res;
        } else {
            return false;
        }
    }

    async function handleSetIsFriend(tf) {
        setIsFriend(tf);
    }

    async function extractPost(data) {
        const arr = [];

        data.receivedPosts.forEach((post) => {
            //console.log(friend);
            if (String(user.Username) === String(post.Author.Username)) {
                post.isAuth = true;
            } else {
                post.isAuth = isUserProfile;
            }
            arr.push(post);
        });
        data.Posts.forEach((post) => {
            //console.log(friend);
            if (String(user.Username) === String(post.Author.Username)) {
                post.isAuth = true;
            } else {
                post.isAuth = isUserProfile;
            }
            arr.push(post);
        });
        return arr;
    }

    async function sortPosts(arr) {
        return arr.sort(function (a, b) {
            return Date.parse(b.Timestamp) - Date.parse(a.Timestamp);
        });
    }

    function handleNewTargetPost(newData) {
        setProfilePost(newData);
        setProfilePostsCounter(profilePostsCounter + 1);
    }

    function handleDeletePostLocal(id) {
        const newPosts = profilePost.filter((post) => post._id !== id);
        setProfilePost(newPosts);
    }
    /*
    async function handleDropdownOnClick(postId) {
        const params = `/${username}/${postId}/profile-post-auth`;
        try {
            const res = await apiClient.get(params, accessHeader);
            if (res.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
        }
    }
*/
    async function handleDeletePost(postId) {
        try {
            const params = `/${username}/${postId}/profile-post-delete`;
            const res = await apiClient.delete(params, accessHeader);
            if (res.status === 200) {
                handleDeletePostLocal(postId);
                setProfilePostsCounter(profilePostsCounter - 1);
                navigate(`/${username}/profile`);
            }
        } catch (err) {
            //setPosts(fortmatResponse(err.response?.data || err));
        }
    }
    /*
    async function handleCmtDropdownOnClick(postId, cmtId) {
        const params = `/${username}/${postId}/comment/${cmtId}/profile-cmt-auth`;
        const res = await apiClient.get(params, accessHeader);
        //console.log(res.data);
        if (res.status === 200) {
            return true;
        } else {
            return false;
        }
    }
*/
    async function handleCmtDeleteOnClick(postId, cmtId) {
        //console.log(`/${postId}/comment/${cmtId}/cmt-auth`);
        const params = `/${username}/${postId}/comment/${cmtId}/profile-delete`;
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
                const res = await apiClient
                    .get(`/${username}/profile`, accessHeader)
                    .then(async (res) => {
                        //console.log(res.data);
                        if (res.data) {
                            setProfileId(res.data._id); //set target profile Id
                            if (user._id === res.data._id) {
                                setIsUserProfile(true);
                            } else {
                                setIsUserProfile(false);
                                setIsFriend(
                                    await checkIsInFriend(
                                        user._id,
                                        res.data.Friends
                                    )
                                );
                            }
                            const posts = await extractPost(res.data);
                            const sortedPosts = await sortPosts(posts);
                            setProfilePost(sortedPosts);
                            setProfileData(res.data);
                            setProfilePostsCounter(posts.length);
                        }
                    });
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
    }, [setUser, setIsLoggedIn, setAccessToken, accessToken, username]);

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
                <ProfileDetail
                    profileData={profileData}
                    profilePostsCounter={profilePostsCounter}
                    isUserProfile={isUserProfile}
                    isFriend={isFriend}
                    handleSetIsFriend={(tf) => handleSetIsFriend(tf)}
                    profileId={profileId}
                />
                <NewTargetPost
                    username={username}
                    profilePost={profilePost}
                    handleNewTargetPost={(nd) => handleNewTargetPost(nd)}
                />
                <Posts
                    posts={profilePost}
                    handleDeletePost={(id) => handleDeletePost(id)}
                    handleCmtDelete={(c, p) => handleCmtDeleteOnClick(c, p)}
                />
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
