import { useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const toLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between px-4 sm:px-8 py-4 items-center shadow-xl">
        <img
          className="w-40 sm:w-48 md:w-60 mb-4 sm:mb-0"
          src="https://cdn2.steamgriddb.com/logo/af1c200b37867473a824e7c94e98d4ec.png"
          alt="Monster Hunter Logo"
        />
        <div className="flex items-center gap-4 sm:gap-10">
          {localStorage.access_token ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white h-10 px-4 py-2 rounded transition-colors duration-200 text-sm sm:text-base"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={toLogin}
              className="bg-green-500 hover:bg-green-600 text-white h-10 px-4 py-2 rounded transition-colors duration-200 text-sm sm:text-base"
            >
              Login
            </button>
          )}
          {/* <button
            onClick={toLogin}
            className="bg-green-500 hover:bg-green-600 text-white h-10 px-4 py-2 rounded transition-colors duration-200 text-sm sm:text-base"
          >
            Login
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white h-10 px-4 py-2 rounded transition-colors duration-200 text-sm sm:text-base"
          >
            Logout
          </button> */}
        </div>
      </div>
    </>
  );
}
