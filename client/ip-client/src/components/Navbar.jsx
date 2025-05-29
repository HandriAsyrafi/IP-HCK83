export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };
  return (
    <>
      <div className="flex justify-between px-8 py-4 items-center shadow-xl">
        <img
          className="w-60"
          src="https://cdn2.steamgriddb.com/logo/af1c200b37867473a824e7c94e98d4ec.png"
          alt=""
        />
        <div className="flex items-center gap-10">
          <div className="font-bold text-lg cursor-pointer">
            My Recommendations
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white h-10 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
