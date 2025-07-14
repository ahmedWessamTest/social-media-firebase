import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { app } from "../firebase";
import { firebaseAuth } from "./auth_service";

const fireStore = getFirestore(app);

export const createUser = async ({ userId, email, userName }) => {
  try {
    await setDoc(doc(fireStore, "users", userId), {
      email: email,
      userName: userName,
      uid: userId,
    });
  } catch (error) {
    console.error("Error when add user:", error);
  }
};

export const addPost = async ({ title, content }) => {
  try {
    await addDoc(collection(fireStore, "posts"), {
      authorName: firebaseAuth.currentUser?.displayName ?? null,
      uid: firebaseAuth.currentUser?.uid ?? null,
      title: title,
      content: content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("post Added");
    return true;
  } catch (error) {
    console.error("Error when adding post:", error);
    return false;
  }
};

export const listenToPosts = (callback) => {
  const q = query(collection(fireStore, "posts"), orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(posts);
  });

  return unsubscribe;
};

export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(fireStore, "posts", postId));
  } catch (error) {
    console.error("Error when delete post:", error);
    throw error;
  }
};

export const editPost = async ({ postId, title, content }) => {
  try {
    await setDoc(
      doc(fireStore, "posts", postId),
      {
        title: title,
        content: content,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("error when edit post:", error);
    return false;
  }
};

export const likePost = async (postId) => {
  const user = firebaseAuth.currentUser;
  const likeRef = doc(fireStore, "posts", postId, "likes", user.uid);
  try {
    const snap = await getDoc(likeRef);
    if (snap.exists()) {
      await deleteDoc(likeRef);
      return { liked: false };
    } else {
      await setDoc(likeRef, {
        likeAuthor: user.displayName ?? "Anonymous",
        createdAt: serverTimestamp(),
      });
      return { liked: true };
    }
  } catch (error) {
    console.error("Error when make like", error);
    throw error;
  }
};

export const likesStream = (callback, postId) => {
  const q = query(
    collection(fireStore, "posts", postId, "likes"),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const likes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(likes);
    },
    (error) => {
      console.error("likes stream error:", error);
    }
  );
  return unsubscribe;
};

export const addComment = async (postId, content) => {
  await addDoc(collection(fireStore, "posts", postId, "comments"), {
    content,
    authorName: firebaseAuth.currentUser.displayName,
    uid: firebaseAuth.currentUser.uid,
    createdAt: serverTimestamp(),
  });
};

export const commentsStream = (postId, callback) => {
  const q = query(
    collection(fireStore, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("sds");

    callback(comments);
  });
};
