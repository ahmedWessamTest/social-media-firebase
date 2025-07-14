import React, { useEffect, useState } from "react";
import { addPost, editPost } from "../src/services/firestore_service";

const AddPostModal = ({
  isOpen,
  setIsOpen,
  isEditMode = false,
  postId,
  initialValue = {
    title: "",
    content: "",
  },
}) => {
  const [postData, setPostData] = useState(initialValue);
  const [isInValid, setIsInValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (isEditMode) {
      setPostData(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const handleChange = (event) => {
    const inpName = event.target.id;
    setPostData((prev) => ({ ...prev, [inpName]: event.target.value }));
  };
  const handleSubmit = async (event) => {
    setIsInValid(false);
    event.preventDefault();
    if (
      !(postData.title.trim().length > 3 && postData.title.trim().length > 3)
    ) {
      setIsInValid(true);
      return;
    }
    if (isEditMode) {
      await handleUpdatePost();
    } else {
      await handleAddPost();
    }
    setTimeout(() => {
      handleClose();
    }, 1000);
  };
  const handleAddPost = async () => {
    const isAdded = await addPost({
      title: postData.title,
      content: postData.content,
    });
    setIsSuccess(isAdded);
  };
  const handleUpdatePost = async () => {
    const isUpdated = await editPost({
      postId: postId,
      title: postData.title,
      content: postData.content,
    });
    setIsSuccess(isUpdated);
  };
  const handleClose = () => {
    setPostData({ title: "", content: "" });
    setIsInValid(false);
    setIsSuccess(false);
    setIsOpen(false);
  };
  return (
    <div
      className={`modal fade show bg-opacity-50 bg-black ${
        isOpen ? "show d-block" : ""
      }`}
      tabIndex={-1}
      inert={!isOpen}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target.role === "dialog") {
          handleClose();
        }
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">New Post</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="col-form-label">
                  Title:
                </label>
                <input
                  value={postData.title}
                  id="title"
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="col-form-label">
                  Content:
                </label>
                <textarea
                  id="content"
                  onChange={handleChange}
                  className="form-control"
                  value={postData.content}
                />
              </div>
              <div className="modal-footer">
                {isInValid && (
                  <div className="alert alert-danger w-100">
                    title and content should more than 3 characters
                  </div>
                )}
                {isSuccess && (
                  <div className="alert alert-success w-100">
                    {isEditMode
                      ? "post updated successfully"
                      : "post added successfully"}
                  </div>
                )}
                <button type="submit" className="btn btn-primary">
                  Create post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPostModal;
