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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-700">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-[320px]
          bg-white/85 backdrop-blur-xl
          rounded-2xl
          px-5 py-6
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        "
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs text-gray-500 mt-1">Sign in to continue</p>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-[11px] font-medium text-gray-600 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full h-10 px-3
              rounded-lg
              border border-gray-300
              bg-white
              text-sm
              focus:outline-none
              focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-500/20
              transition
            "
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-[11px] font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full h-10 px-3
              rounded-lg
              border border-gray-300
              bg-white
              text-sm
              focus:outline-none
              focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-500/20
              transition
            "
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[11px] text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="
            w-full h-10
            rounded-lg
            text-sm font-semibold
            text-white
            bg-gradient-to-r from-indigo-600 to-pink-500
            shadow-md
            active:scale-[0.98]
            hover:shadow-lg
            transition
          "
        >
          Login
        </button>

        {/* Demo creds */}
        <div className="mt-5 rounded-lg bg-gray-100 px-3 py-2 text-center text-[10px] text-gray-600">
          Use demo credentials&nbsp;
          <span className="font-mono text-gray-800">Anshul / 7558</span>
        </div>
      </form>
    </div>
  );
};

export default Login;
