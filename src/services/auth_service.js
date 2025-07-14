import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { app } from "../firebase";
import { createUser } from "./firestore_service";

export const firebaseAuth = getAuth(app);

export async function register(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: username,
    });

    await createUser({
      userId: userCredential.user.uid,
      email: email,
      userName: username,
    });

    return userCredential;
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
}

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Login Error:", error.code, error.message);
    throw error;
  }
}
export async function signout() {
  try {
    await signOut(firebaseAuth);
    return true;
  } catch (error) {
    console.error("Logout Error:", error.code, error.message);
    throw error;
  }
}
