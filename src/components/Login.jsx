import { useEffect, useState, useRef } from "react";
import axios from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useInput from "../hooks/useInput.js";
import useToggle from "../hooks/useToggle.js";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const [user, resetUser, userAttribs] = useInput("user", ""); // useLocalStorage("user", ""); // useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [check, toggleCheck] = useToggle("persist", false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      setAuth({ user, accessToken });
      resetUser();
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Username and Password are required");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current?.focus();
    }
  };

  // const togglePersist = () => {
  //   setPersist((prev) => !prev);
  // };

  // useEffect(() => {
  //   localStorage.setItem("persist", persist);
  // }, [persist]);

  return (
    <section>
      <p
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
        ref={errRef}
      >
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          required
          {...userAttribs}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          required
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value);
            setErrMsg("");
          }}
        />
        <button type="submit">Sign In</button>
        <div className="persistCheck">
          <input
            type="checkbox"
            checked={check}
            onChange={toggleCheck}
            id="persist"
          />
          <label htmlFor="persist">Trust this devise</label>
        </div>
      </form>
      <p>
        Need an account?
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;
