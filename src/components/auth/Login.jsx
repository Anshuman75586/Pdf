import { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "Anshul" && password === "7558") {
      onLogin(true);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 sm:mb-8 text-gray-800 tracking-wide">
          🔐 Login Portal
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 sm:p-3 mb-4 sm:mb-5 rounded-lg border border-gray-300 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 sm:p-3 mb-4 sm:mb-5 rounded-lg border border-gray-300 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="bg-red-200 text-red-800 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 text-xs sm:text-sm text-center shadow-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 sm:py-3 rounded-lg font-semibold cursor-pointer text-white bg-gradient-to-r from-indigo-600 to-pink-500 shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
        >
          Login
        </button>

        <p className="text-[10px] sm:text-xs text-center mt-4 sm:mt-6 text-gray-700 bg-gray-100 p-2 rounded-lg shadow-inner">
          Demo: <span className="font-mono">Anshul / 7558</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
