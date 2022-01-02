import Comment from './Comment';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import '../style/Comments.css';

function Comments({
    comments,
    handleCommentDeleteOnClick,
    handleCmtDeleteOnClickLocal,
}) {
    async function cmtDeleteOnClick(cid) {
        await handleCommentDeleteOnClick(cid);
    }
    async function deleteCommentLocal(id) {
        await handleCmtDeleteOnClickLocal(id);
    }
    const commentRender = (comment) => {
        return (
            <Comment
                comment={comment}
                key={comment._id}
                handleCommentDeleteOnClick={(cid) => cmtDeleteOnClick(cid)}
                deleteCmtLocal={(id) => deleteCommentLocal(id)}
            />
        );
    };
    if (comments) {
        return (
            <div className="comments-container">
                {comments.map((comment) => commentRender(comment))}
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default Comments;
