import { useState, useEffect } from "react";
import { auth, database } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const formatAuthUser = (user: any) => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState: any) => {
    if (!authState) {
      setLoading(false);
      return;
    }

    setLoading(true);

    var formattedUser = formatAuthUser(authState);

    setAuthUser(formattedUser);

    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signInWithEAndP = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const createUserWithEAndP = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signOut = () => auth.signOut().then(clear);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithEAndP,
    createUserWithEmailAndPassword,
    signOut,
  };
}
