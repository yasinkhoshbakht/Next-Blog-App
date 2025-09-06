"use client";

import { getUserApi, signupApi, singinApi } from "@/services/authService";
import { useRouter } from "next/navigation";
import { createContext, useReducer, useContext, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { user, isAuthenticated, loading, error } = state;

  const signin = async (values) => {
    dispatch({ type: "LOADING" });
    try {
      const { user, message } = await singinApi(values);
      dispatch({ type: "SUCCESS", payload: user });
      toast.success(message);
      router.push("/");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Signin failed";
      dispatch({ type: "ERROR", payload: errorMsg });
      toast.error(errorMsg);
    }
  };

  const signup = async (values) => {
    dispatch({ type: "LOADING" });
    try {
      const { user, message } = await signupApi(values);
      dispatch({ type: "SUCCESS", payload: user });
      toast.success(message);
      router.push("/");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Signup failed";
      dispatch({ type: "ERROR", payload: errorMsg });
      toast.error(errorMsg);
    }
  };

  const loadCurrentUser = async () => {
    dispatch({ type: "LOADING" });
    try {
      const { user } = await getUserApi();
      dispatch({ type: "SUCCESS", payload: user });
    } catch (err) {
      dispatch({ type: "ERROR", payload: null });
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, error, signin, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext not found");
  return context;
};
