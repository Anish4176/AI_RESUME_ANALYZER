import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Welcome</h1>
          <h2>Login to continue Your Job Journey</h2>
        </div>
        <div>
          {isLoading ? (
            <button className="auth-button animate-pulse">
              <p>Signing you in...</p>
            </button>
          ) : (
            <>
              {auth.isAuthenticated ? (
                <button className="auth-button" onClick={auth.signOut}>
                  <p>Log Out</p>
                </button>
              ) : (
                <button className="auth-button" onClick={auth.signIn}>
                  <p>Log In</p>
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Auth;
