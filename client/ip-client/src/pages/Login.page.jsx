import GoogleButton from "../components/GoogleLogin.button";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    try {
      e.preventDefault();

      const { data } = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const access_token = data.token;

      console.log(access_token);

      localStorage.setItem("access_token", access_token);
      navigate("/");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You are not authorized",
      });
      navigate("/login");
    }
  }

  return (
    <>
      <div className="flex w-200 text-center mx-auto h-screen items-center">
        <div className="w-1/2">
          <img
            className="h-150 mx-auto"
            src="https://pbs.twimg.com/media/GAzLJeVbsAAa7b-?format=png&name=large"
            alt=""
          />
        </div>
        <div className="w-1/2 ">
          <img
            className="w-70 mx-auto mb-10"
            src="https://cdn2.steamgriddb.com/logo/af1c200b37867473a824e7c94e98d4ec.png"
            alt=""
          />
          <form onSubmit={handleLogin}>
            <div>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-1  w-60 py-2 rounded mb-3 px-2 text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-1  w-60 py-2 rounded mb-3 px-2 text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-60 py-2 bg-amber-400 rounded mb-3 border-gray-500 text-sm"
              >
                Login
              </button>
            </div>
            <GoogleButton />
          </form>
        </div>
      </div>
    </>
  );
}
