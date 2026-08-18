import axios from "../api/axios.js";
import useAuth from "./useAuth.js";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth("");
    try {
      const response = await axios.get("logout", { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
