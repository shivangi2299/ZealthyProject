"use client";

import React, { useState } from "react";
import SignupForm from "@/components/sign-up/page";
import LoginForm from "@/components/login-form/page";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4">
      {isLogin ? (
        <LoginForm goToSignup={() => setIsLogin(false)} />
      ) : (
        <SignupForm goToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default Auth;
