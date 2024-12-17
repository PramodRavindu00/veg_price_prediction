import { useContext } from "react";
import AuthContext from "../components/AuthContextProvider";

export const useAuth = () => useContext(AuthContext);
