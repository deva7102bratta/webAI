import React from 'react';

const AuthPage = ({ mode }) => {
  return (
    <div>
      <h1>{mode === "login" ? "Login Page" : "Register Page"}</h1>
    </div>
  );
};

export default AuthPage;