import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../../store/slices/authSlice";

import { loginUser } from "../services/authService";

function LoginPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      dispatch(loginStart());

      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
          role: data.role,
        })
      );

      navigate("/");

    } catch (error) {

      console.error(error);

      dispatch(loginFailure());

      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}

export default LoginPage;