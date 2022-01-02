import Header from '../components/Header';
import Footer from '../components/Footer';
import Posts from '../components/Posts';
import NewPost from '../components/NewPost';
import Friends from '../components/Friends';
import Chat from '../components/Chat';
import apiClient from './http-common';
import { io } from 'socket.io-client';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import { GlobalContext } from '../context/GlobalState';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../style/Home.css';

function Home() {
    const {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        accessToken,
        setAccessToken,
    } = useContext(GlobalContext);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [messageTid, setMessageTid] = useState([]);
    const [onlineUsers, setOnlineUser] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState('');
    const [newMessageNotification, setNewMessageNotification] = useState(false);
    const [isHomePage, setIsHomePage] = useState(true);
    const [isContactsOpen, setIsContactsOpen] = useState(false);
    const [chattingWith, setChattingWith] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    //const [socket, setSocket] = useState(null);
    const socket = useRef();
    const navigate = useNavigate();
    const isMounted = useRef(false);
    const accessHeader = {
        headers: {
            'x-access-token': accessToken,
        },
    };

    // this hook to let the socket only call once
    useEffect(() => {
        socket.current = io(process.env.REACT_APP_SOCKET, {
            //socket.current = io('nameless-harbor-96114.herokuapp.com', {
            extraHeaders: {
                //'Access-Control-Allow-Origin': 'http://localhost:3000 ',
            },
            //withCredentials: true,
        });
        socket.current.on('getMessage', (data) => {
            //console.log(data);

            //if (user._id === data.receiverId) {
            setArrivalMessage({
                SendBy: data.senderId,
                receiverId: data.receiverId,
                text: data.text,
                Timestamp: new Date(),
            });
            // }
        });
    }, []);

    useEffect(() => {
        if (arrivalMessage) {
            console.log(arrivalMessage.receiverId);
        }
    }, [arrivalMessage]);

    useEffect(() => {
        isMounted.current = true;
        if (user && socket && socket.current && socket.current.id) {
            //console.log('socket.id: ' + socket.current.id);
            socket.current.emit('addUser', user._id);
            socket.current.on('getUsers', (users) => {
                //console.log(users);
                // use isMounted to fix memory leak
                if (isMounted.current) setOnlineUser(users);
            });
        }
        return () => {
            isMounted.current = false;
        };
    }, [user, accessToken]); // if user refresh too much

    /*async function extractPost(data) {
        let arr = [...data.Posts];
        //console.log(data);
        data.Friends.forEach((friend) => {
            //console.log(friend);
            arr.push(...friend.Posts);
        });

        return arr;
    }*/

    function handleSocketSendMessage(rid, text) {
        //console.log(rid, text);
        socket.current.emit('sendMessage', {
            senderId: user._id,
            receiverId: rid,
            text: text,
        });
    }

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
                    post.isAuth = false;
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

    /*
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('bookUser'));
        //console.log(accessToken);
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
    //}, [setUser, setIsLoggedIn, accessToken]);*/
    async function getPostsData() {
        if (accessToken != null && page) {
            const accessHeader = {
                headers: {
                    'x-access-token': accessToken,
                },
            };
            const resUser = await apiClient.get('/posts', accessHeader);
            const res = await apiClient.get(
                `/page_posts?page=${page}&limit=${10}`,
                accessHeader
            );
            setPage(page + 1);
            const userData = resUser.data;
            localStorage.setItem('bookUser', JSON.stringify(userData));
            setUser(userData);
            setPosts(res.data);
            return res.data;
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

    async function fetchData() {
        const newData = await getPostsData();
        setPosts(newData);
        if (newData.length === posts.length) setHasMore(false);
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('bookUser'));
        //console.log(accessToken);

        if (user !== null) {
            //console.log('user is not null');
            setIsLoggedIn(true);
            setUser(user);
            getPostsData();
        } else {
            navigate('/signin');
        }
    }, [setUser, setIsLoggedIn, accessToken]);

    async function handleFriendMessageOnClick(tid, fullname) {
        setIsChatOpen(true);
        setMessageTid(tid);
        setChattingWith(fullname);
    }

    async function handleChatClose() {
        setIsChatOpen(false);
    }

    function handleChatOnClick(e) {
        e.preventDefault();
        setIsContactsOpen(!isContactsOpen);
    }

    return (
        <div className="body-container">
            <Header
                isHomePage={isHomePage}
                handleChatOnClick={handleChatOnClick}
            />
            <div className="body">
                <div className="body-middle">
                    <NewPost
                        handleNewSelfPost={(data) => handleNewSelfPost(data)}
                        extractPost={extractPost}
                        sortPosts={sortPosts}
                        posts={posts}
                    />
                    <InfiniteScroll
                        dataLength={posts.length} //This is important field to render the next data
                        next={fetchData}
                        hasMore={hasMore}
                        loader={
                            <h4 style={{ textAlign: 'center' }}>Loading...</h4>
                        }
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>End of Posts</b>
                            </p>
                        }
                    >
                        <Posts
                            posts={posts}
                            handleDeletePost={(id) => handleDeletePost(id)}
                            handleCmtDelete={(c, p) =>
                                handleCmtDeleteOnClick(c, p)
                            }
                        />
                    </InfiniteScroll>
                </div>
                <div className={isContactsOpen ? 'body-right' : 'hidden'}>
                    <Friends
                        handleFriendMessageOnClick={(tid, fullname) =>
                            handleFriendMessageOnClick(tid, fullname)
                        }
                        onlineUsers={onlineUsers}
                        arrivalMessage={arrivalMessage}
                        isChatOpen={isChatOpen}
                    />
                    {user ? (
                        <Chat
                            displayClass={isChatOpen ? 'active' : 'hidden'}
                            uid={user._id}
                            tid={messageTid}
                            chattingWith={chattingWith}
                            handleChatClosed={() => handleChatClose()}
                            handleSocketSend={(rid, text) =>
                                handleSocketSendMessage(rid, text)
                            }
                            arrivalMessage={arrivalMessage}
                            isChatOpen={isChatOpen}
                        />
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;
