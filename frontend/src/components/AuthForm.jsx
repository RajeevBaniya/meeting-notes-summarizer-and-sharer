import { useState } from "react";
import { signIn, signUp } from "../lib/supabase";

function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = isLogin
        ? await signIn(email, password)
        : await signUp(email, password, name);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.data?.session) {
        localStorage.setItem("sb-token", result.data.session.access_token);
        onAuthSuccess(result.data.session);
      } else if (!isLogin) {
        setError("Check your email to confirm your account");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="auth-subtitle">
          {isLogin
            ? "Enter your credentials to continue"
            : "Start summarizing meetings today"}
        </p>
      </div>

      {error && (
        <div className="auth-error">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required={!isLogin}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" disabled={isLoading} className="auth-submit">
          {isLoading ? (
            <>
              <span className="auth-spinner"></span>
              {isLogin ? "Signing in..." : "Creating account..."}
            </>
          ) : isLogin ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <div className="auth-footer">
        <span>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </span>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="auth-switch"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
