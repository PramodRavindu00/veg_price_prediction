import axios from "axios";

export const autoLogout = async (setAuth,navigate,setUserData) => {
  try {
    const res = await axios.post(
      "/api/auth/logOut",
      {},
      { withCredentials: true }
    );

    if (res.data.success) {
      sessionStorage.clear();
      setAuth({
        isLoggedIn: false,
        userId: null,
        userType: null,
      });
      setUserData(null);

      console.log(res.data.message);
      navigate("/login");
    }
  } catch (error) {
    console.log(error);
  }
};
