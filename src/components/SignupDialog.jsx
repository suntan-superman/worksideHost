/* eslint-disable no-tabs */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
// import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
// import { useStateContext } from '../contexts/ContextProvider';
import { useUserContext } from "../hooks/useUserContext";
import { toast } from "react-toastify";

const SignupDialog = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    password: "",
  });
  const { usersData, dispatch } = useUserContext();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/user/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (response.ok) {
      toast.success("Check Email...");
      // dispatch({ type: "CREATE_USER", payload: json });
      navigate("/login");
    }
  };

  return (
    // eslint-disable-next-line react/jsx-indent
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black bg-opacity-25 backdrop-blur-sm">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalContainer"
      >
        <div className="bg-white rounded-2xl shadow-2xl flex flex-row w-full align-middle">
          {/* Sign In Section */}
          <div className="w-2/5 p-20">
            <div className="text-left font-bold">
              <span className="text-green-500">WORK</span>SIDE
            </div>
            <div className="bg-white w-72 p-2 flex flex-col items-center mb-3">
              <h2 className="text-3xl font-bold text-green-500 mb-2">
                Welcome Back!!
              </h2>
              <Link to="/login">
                <button
                  type="button"
                  className="border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white"
                >
                  Sign In
                </button>
              </Link>
            </div>
          </div>
          {/* Sign Up Section */}
          <div className="w-2/5 p-5 bg-gray-500">
            <div className="bg-gray-500 rounded-2xl shadow-2xl flex flex-col items-center w-full align-middle">
              <div className="bg-gray-500 w-72 p-2 flex flex-col items-center mb-3">
                <form
                  className="flex flex-col items-center"
                  onSubmit={handleSubmit}
                >
                  <h2 className="text-3xl font-bold text-green-500 mb-2">
                    Create Account
                  </h2>
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    onChange={handleChange}
                    value={data.firstName}
                    required
                    // className="bg-gray-200 outline-none text-sm flex-1"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    onChange={handleChange}
                    value={data.lastName}
                    required
                    // className="bg-gray-200 outline-none text-sm flex-1"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    name="company"
                    onChange={handleChange}
                    value={data.company}
                    required
                    // className="bg-gray-200 outline-none text-sm flex-1"
                    className={styles.input}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={data.email}
                    required
                    // className="bg-gray-200 outline-none text-sm flex-1"
                    className={styles.input}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    value={data.password}
                    required
                    // className="bg-gray-200 outline-none text-sm flex-1"
                    className={styles.input}
                  />
                  {error && <div className={styles.error_msg}>{error}</div>}
                  <button
                    type="submit"
                    className="border-2 bg-white border-green-500 text-green-500 rounded-full px-12 py-3 inline-block font-semibold hover:bg-green-500 hover:text-white"
                  >
                    Sign Up
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupDialog;
