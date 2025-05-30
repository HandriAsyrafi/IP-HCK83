export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
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
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white h-10 px-4 py-2 rounded transition-colors duration-200 text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
