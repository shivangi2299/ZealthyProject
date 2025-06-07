"use client";

import { useState, useEffect } from "react";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { doc, setDoc, getDoc } from "firebase/firestore";

const LoginForm = ({ switchToSignup, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [
    signInWithEmailAndPassword,
    userCredential,
    loading,
    firebaseError
  ] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setError(null);
  }, []);

  const createUserDocIfNotExists = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        firstName: "",
        lastName: "",
        phone: "",
        birthdate: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        createdAt: new Date().toISOString(),
      });
      console.log("✅ User doc created with UID as ID");
    } else {
      console.log("⚠️ User doc already exists.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) return;

    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res && res.user) {
        await createUserDocIfNotExists(res.user);
        setEmail("");
        setPassword("");
        setError("");
        onSuccess(); // Move to next step
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">
          Log In to Your Account
        </h2>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
          autoComplete="off" // Disable form autofill
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="off" // Disable input autofill
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {firebaseError && !error && (
            <p className="text-sm text-red-600 text-center">
              {firebaseError.message}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <button onClick={switchToSignup} className="text-blue-600 hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
