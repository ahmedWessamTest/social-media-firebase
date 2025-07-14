import PostCard from "../../components/postCard";
import Navbar from "../../components/navbar";
import { useEffect, useState } from "react";
import AddPostModal from "../../components/addPostModal";
import { listenToPosts } from "../services/firestore_service";

const Home = () => {
  const [addPostIsOpen, setAddPostIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToPosts(setPosts);
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="container-fluid min-vh-100 bg-white font-sans">
        <Navbar />
        <main className="container py-4">
          <button
            className="add-post-btn mx-auto d-block"
            onClick={() => setAddPostIsOpen(true)}
          >
            <i className="fa-solid fa-plus me-2"></i> Add Post
          </button>
          <h3 className="fw-bold mb-4">Latest Posts</h3>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>
      </div>
      <AddPostModal isOpen={addPostIsOpen} setIsOpen={setAddPostIsOpen} />
    </>
  );
};

export default Home;
