export default function Home() {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Monster Hunter App</h1>
      <p className="mb-4">You have successfully logged in!</p>
      <button 
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}