import GoogleButton from "../components/GoogleLogin.button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearLoginError } from "../store/authSlice";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle error messages
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      dispatch(clearLoginError());
    }
  }, [error, dispatch]);

  // Handle successful login
  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Login successful",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    }
  }, [success, navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all fields",
      });
      return;
    }

    dispatch(loginUser({ email, password }));
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
            </div>{" "}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-60 py-2 rounded mb-3 border-gray-500 text-sm ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-amber-400 hover:bg-amber-500"
                }`}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
            <GoogleButton />
          </form>
        </div>
      </div>
    </>
  );
}
