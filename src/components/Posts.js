import Post from './Post';
import '../style/Posts.css';

function Posts({ posts, handleDeletePost, handleCmtDelete }) {
    async function localHandleCmtDelete(c, p) {
        handleCmtDelete(c, p);
    }
    const postRender = (post) => {
        if (post && post._id) {
            return (
                <Post
                    post={post}
                    key={post._id}
                    handleDeletePost={(id) => handleDeletePost(id)}
                    handleCmtDeleteOnClick={(c, p) =>
                        localHandleCmtDelete(c, p)
                    }
                />
            );
        }
    };
    if (posts && posts.length > 0) {
        return (
            <div className="posts-container">
                {posts.map((post) => postRender(post))}
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default Posts;
