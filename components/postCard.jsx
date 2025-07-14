import { memo, useEffect, useState } from "react";
import { firebaseAuth } from "../src/services/auth_service";
import {
  addComment,
  commentsStream,
  deletePost,
  likePost,
  likesStream,
} from "../src/services/firestore_service";
import AddPostModal from "./addPostModal";

const PostCard = ({ post }) => {
  const userInitials = post.authorName?.slice(0, 2).toUpperCase();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const handleLikeClick = async () => {
    try {
      await likePost(post.id);
    } catch (error) {
      console.error("error when add like", error);
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim().length < 1) return;
    const res = await addComment(post.id, newComment.trim());
    console.log(res);

    setNewComment("");
  };
  useEffect(() => {
    const unSubLikes = likesStream(setLikes, post.id);
    let unSubComments = () => {};
    console.log(showComments);

    if (showComments) {
      console.log("open");
      unSubComments = commentsStream(post.id, setComments);
    }
    return () => {
      unSubLikes();
      unSubComments();
    };
  }, [post.id, showComments]);
  return (
    <>
      <div className="mb-4 row align-items-center card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>{post.title}</h4>
          {firebaseAuth.currentUser.uid === post.uid && (
            <div className="dropdown">
              <button
                aria-label="post settings"
                className="btn border-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    onClick={() => setIsOpenModal(true)}
                    className="dropdown-item text-primary"
                  >
                    <span>Edit </span>
                    <i className="fa-solid fa-file-pen"></i>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      deletePost(post.id).catch((err) => {
                        alert(err);
                      });
                    }}
                    className="dropdown-item text-danger"
                  >
                    <span>delete </span>
                    <i className="fa-solid fa-trash "></i>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="card-body">
          <figure>
            <blockquote className="blockquote">
              <p className="card-text text-muted">{post.content}</p>
            </blockquote>
            <figcaption>
              <p className="card-text d-flex align-items-center gap-2">
                <span
                  className="rounded-circle d-inline-flex justify-content-center align-items-center"
                  style={{
                    width: "35px",
                    height: "35px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {userInitials}
                </span>
                <small className="text-muted">
                  Posted by @{post.authorName}
                </small>
              </p>
            </figcaption>
          </figure>
        </div>
        <div className="d-flex  mt-2 card-footer">
          <button
            onClick={handleLikeClick}
            className="btn border-0"
            title="like"
          >
            {likes.find(({ id }) => id === firebaseAuth.currentUser.uid) ? (
              <i className=" fa-solid fa-heart"></i>
            ) : (
              <i className="fa-regular fa-heart"></i>
            )}
            <span> {likes.length}</span>
          </button>
          <button
            className="btn"
            title="comment"
            onClick={() => setShowComments((prev) => !prev)}
          >
            <i className="fa-regular fa-comment-dots"></i>
            <span> {comments.length}</span>
          </button>
        </div>
        {showComments && (
          <div className="card-footer bg-light">
            <form onSubmit={handleAddComment} className="d-flex gap-2 mb-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="form-control"
                placeholder="Write a comment..."
              />
              <button type="submit" className="btn btn-primary">
                Post
              </button>
            </form>
            <ul className="list-group">
              {comments.map((comment) => (
                <li key={comment.id} className="list-group-item">
                  {console.log(comment)}
                  <strong>{comment.authorName}:</strong> {comment.content}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <AddPostModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        isEditMode={true}
        postId={post.id}
        initialValue={{ title: post.title, content: post.content }}
      />
    </>
  );
};

export default memo(PostCard);
