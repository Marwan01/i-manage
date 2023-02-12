import { useContext } from "react";
import { AuthContext } from "../contexts/firebaseContext";
const useFirebase = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("Auth context must be use inside AuthProvider");

  return context;
};

export default useFirebase;
