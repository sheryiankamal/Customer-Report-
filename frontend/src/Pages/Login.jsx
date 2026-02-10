const Login = ({
  error,
  handleLogin,
  Email,
  setemail,
  password,
  setPassword,
}) => {
  return (
    <div className="w-70 mx-auto mt-10 p-10 border rounded-md">
      <input
        onChange={(e) => setemail(e.target.value)}
        className="block mb-3 px-3 py-2 border border-gray-500 rounded-md"
        type="email"
        name="email"
        value={Email}
        placeholder="Enter email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        className="px-3 py-2 mb-3 border border-gray-500 rounded-md"
        type="password"
        name="password"
        value={password}
        placeholder="Enter password"
      />
      {error && <div className="text-red-500 mb-2 font-semibold">{error}</div>}
      <button
        onClick={handleLogin}
        className="px-3 py-2 bg-blue-400 text-white rounded-md"
      >
        Sign in
      </button>
    </div>
  );
};

export default Login;
