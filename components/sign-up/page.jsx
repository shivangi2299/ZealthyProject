"use client";

import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";

const SignupForm = ({ switchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [
    createUserWithEmailAndPassword,
    user,
    firebaseLoading,
    firebaseError,
  ] = useCreateUserWithEmailAndPassword(auth);

  const validatePassword = (pwd) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return pattern.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(email, password);

      if (res && res.user) {
        // Store email in Firestore under "emails" collection
        const db = getFirestore();
        await setDoc(doc(collection(db, "emails"), res.user.uid), {
          email,
          createdAt: new Date().toISOString(),
        });

        alert("Account created successfully!");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
        switchToLogin(); // go to login page
      }
    } catch (err) {
     // console.error("Firebase signup error:", err);

      if (err.code === "auth/email-already-in-use") {
        setErrors({
          email: "This email is already registered. Try logging in.",
        });
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErrors({
          general: "Failed to create account. Try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">
          Create Your Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`mt-1 w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none`}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className={`mt-1 w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none`}
              required
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Verify Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className={`mt-1 w-full px-4 py-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none`}
              required
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-sm text-red-600 text-center">{errors.general}</p>
          )}

          {firebaseError && !errors.general && (
            <p className="text-sm text-red-600 text-center">{firebaseError.message}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
              disabled={loading || firebaseLoading}
            >
              {loading || firebaseLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button onClick={switchToLogin} className="text-blue-600 hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
