import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth_service";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState("");
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    setInvalidMessage("");
    setError("");
    e.preventDefault();
    console.log("Form Data:", formData);
    async function postUserData() {
      setIsLoading(true);
      try {
        const data = await register(
          formData.email,
          formData.password,
          formData.username
        );
        console.log(data);
        if (data) {
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("error when register", error.message);
        setError("already exist");
        setTimeout(() => {
          setError("");
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    }
    if (validations()) {
      postUserData();
    }
  };
  const validations = useCallback(() => {
    const emailReg = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
    const passReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (formData.username.trim().length < 3) {
      setInvalidMessage("should username be greater than 3 characters");
      return false;
    }
    if (!emailReg.test(formData.email)) {
      setInvalidMessage("Invalid email format");
      return false;
    }
    if (!passReg.test(formData.password)) {
      setInvalidMessage(
        "Password must be at least 8 characters, include one capital letter and one number"
      );
      return false;
    }
    return true;
  }, [formData]);
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4">
            <div className="card-body">
              <h3 className="text-center mb-4">Register</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

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
                  already have <Link to="/auth/login">account</Link>{" "}
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
                  Register
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

export default Register;
