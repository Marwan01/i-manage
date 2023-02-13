import PropTypes from "prop-types";
import { createContext, useEffect, useReducer, useState } from "react";
import { initializeApp } from "firebase/app";
import swal from "sweetalert";
import { useRouter } from "next/router";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc, getDocs, addDoc } from "firebase/firestore";
//
import { FIREBASE_API } from "../config";
import Upper from "../utils/upper";

// ----------------------------------------------------------------------

const firebaseApp = initializeApp(FIREBASE_API);

const AUTH = getAuth(firebaseApp);

const DB = getFirestore(firebaseApp);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  opportunities: [],
};

const reducer = (state, action) => {
  if (action.type === "INITIALISE") {
    const { isAuthenticated, user, opportunities } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      opportunities,
    };
  }

  return state;
};

const AuthContext = createContext({
  ...initialState,
  method: "firebase",
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getOpportunities: () => Promise.resolve(),
  createOpportunities: () => Promise.resolve(),
});
// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { push } = useRouter();
  const [profile, setProfile] = useState(null);
  const [allOpportunities, setAllOpportunities] = useState(null);
  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          const userRef = doc(DB, "users", user.email);

          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const d = docSnap.data();
            d.displayName = `${Upper(d?.companyName)}`;
            setProfile(d);
          }
          getOpportunities();
          dispatch({
            type: "INITIALISE",
            payload: { isAuthenticated: true, user },
          });
        } else {
          dispatch({
            type: "INITIALISE",
            payload: { isAuthenticated: false, user: null },
          });
        }
      }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const router = useRouter();
  const login = async (email, password) => {
    signInWithEmailAndPassword(AUTH, email, password)
      .then(() => {
        push("/opportunities");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          swal("Wrong password!", "Enter the correct password.", "error", {
            button: "ok",
          });
        } else if (errorCode === "auth/user-not-found") {
          swal({
            title: "user not found!",
            text: "Please register first.",
            icon: "warning",
            buttons: true,
          }).then((signup) => {
            if (signup) {
              router.push("register/");
            }
          });
        } else {
          swal(errorMessage, errorCode, "error", {
            button: "ok",
          });
        }
      });
  };

  const register = (email, password, companyName) =>
    createUserWithEmailAndPassword(AUTH, email, password)
      .then(async () => {
        email = email.toLowerCase();
        companyName = Upper(companyName);
        const userRef = doc(collection(DB, "users"), email);

        await setDoc(userRef, {
          email,
          companyName,
        });
        push("/opportunities");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/weak-password") {
          swal("Weak password!", "please write a stronger password.", "warning", {
            button: "ok",
          });
        } else if (errorCode === "auth/email-already-in-use") {
          swal({
            title: "Email already used!",
            text: "You already have an account with this email. Redirect to login page.",
            icon: "warning",
            buttons: true,
          }).then((signin) => {
            if (signin) {
              router.push("/login/");
            }
          });
        } else {
          swal(errorMessage, errorCode, "error", {
            button: "ok",
          });
        }
      });

  const logout = () => signOut(AUTH);
  const getOpportunities = () => async () => {
    onAuthStateChanged(AUTH, async (user) => {
      if (user) {
        const oppRef = await getDocs(collection(DB, "users", user?.email, "opportunities"));
        const opp = oppRef?.docs?.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setAllOpportunities(opp);
      }
    });
  };
  const createOpportunities = (newOpportunity) => async () => {
    onAuthStateChanged(AUTH, async (user) => {
      const docRef = await addDoc(
        collection(DB, "users", user.email, "opportunities"),
        newOpportunity
      );
      newOpportunity.id = docRef.id;
      setAllOpportunities(allOpportunities.push(newOpportunity));
    });
  };
  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "firebase",
        user: {
          id: state?.user?.uid,
          email: state?.user?.email,
          companyName: state?.user?.companyName || profile?.companyName,
          displayName: state?.user?.displayName || profile?.displayName,
        },
        login,
        register,
        logout,
        createOpportunities,
        opportunities: allOpportunities,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
