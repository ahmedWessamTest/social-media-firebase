import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/auth_service";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [invalidMessage, setInvalidMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validations = useCallback(() => {
    const emailReg = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

    if (!emailReg.test(formData.email)) {
      setInvalidMessage("Invalid email");
      return false;
    }

    if (formData.password.length < 6) {
      setInvalidMessage("Password must be at least 6 characters");
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setInvalidMessage("");

    async function loginUser() {
      setIsLoading(true);
      try {
        const data = await login(formData.email, formData.password);
        const user = data.user;
        const token = user.accessToken;
        localStorage.setItem("userToken", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
        navigate("/");
      } catch (err) {
        console.error("Login failed:", err.message);
        setError("Wrong email or password");
        setTimeout(() => setError(""), 4000);
      } finally {
        setIsLoading(false);
      }
    }

    if (validations()) {
      loginUser();
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4">
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <p className="text-center">
                  Don’t have an account? <Link to="/auth/register">Signup</Link>
                </p>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {invalidMessage && (
                  <div className="alert alert-danger" role="alert">
                    {invalidMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
                >
                  Login
                  {isLoading && (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
