import { LogOut as LogOutIcon } from "lucide-react";

const Header = ({ onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log("Logout clicked!");
    }
  };

  return (
    <header
      className="
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        backdrop-blur-md
        border-b border-white/20
        px-4 sm:px-6 py-3 sm:py-4
        flex flex-col sm:flex-row items-center sm:justify-between
        shadow-lg
      "
    >
      <h1 className="text-lg sm:text-xl font-bold text-white drop-shadow-md text-center sm:text-left">
        PDF Editor
      </h1>

      <button
        onClick={handleLogout}
        className="
          flex items-center gap-2
          px-3 sm:px-4 py-2
          bg-white/20 text-white font-medium
          rounded-lg
          transition-all duration-300 ease-in-out
          hover:bg-white/30 hover:scale-105
          active:scale-95 cursor-pointer
        "
      >
        <LogOutIcon size={18} />
        Logout
      </button>
    </header>
  );
};

export default Header;
