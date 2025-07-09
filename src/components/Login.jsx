import { useState, useEffect } from "react";

export default function Login({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (!savedEmail) setIsNewUser(true);
  }, []);

  const handleAuth = async () => {
    if (!email || !password || (isNewUser && !name)) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const url = isNewUser
        ? "http://lifeline-backend-fr78.onrender.com/api/auth/register" // or your Render URL
        : "http://lifeline-backend-fr78.onrender.com/api/auth/login";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("username", data.name || name);
        localStorage.setItem("email", email);
        setUser(data.name || name);
        alert(isNewUser ? "Account created!" : `Welcome back, ${data.name}!`);
      } else {
        alert(data.message || "Authentication failed.");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      alert("Server error. Check your backend.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 to-pink-300 p-4">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-[22rem] text-center border border-purple-200 animate-fade-in">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          {isNewUser ? "Sign Up for Calcura" : "Login to Calcura"}
        </h1>

        {isNewUser && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 rounded-xl border border-gray-300 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          onClick={handleAuth}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          {isNewUser ? "Create Account" : "Login"}
        </button>

        <p className="mt-5 text-sm text-gray-700">
          {isNewUser ? "Already have an account?" : "New to Calcura?"}{" "}
          <button
            className="text-purple-700 underline font-medium"
            onClick={() => setIsNewUser(!isNewUser)}
          >
            {isNewUser ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}






