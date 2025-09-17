import { createContext, use, useEffect, useState } from "react";
import firebase from "../service/firebase";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  logout: () => void;
  isLoggedIn: boolean;
  user: any;
  isUserLoggedIn: (page:string) => void;

}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const isUserLoggedIn = (page:string) => {
    firebase.onAuthStateChanged((res) => {
      if (res) {
        setUser(res);
        setIsLoggedIn(true);
        navigate(page);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        navigate('/');
      }
    });
  };
  
  useEffect(() => {
    console.log("AuthProvider mounted");
  }, []);

  const logout = () => {
    firebase.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ logout, isLoggedIn, user, isUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;