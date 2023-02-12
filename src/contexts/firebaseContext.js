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
import { getFirestore, collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
//
import { FIREBASE_API } from "../config";
import Upper from "../utils/upper";

// ----------------------------------------------------------------------

const firebaseApp = initializeApp(FIREBASE_API);

const AUTH = getAuth(firebaseApp);

const DB = getFirestore(firebaseApp);

const initialState = {
  isAuthenticated: true,
  isInitialized: false,
  user: null,
  valunteers: [],
};

const reducer = (state, action) => {
  if (action.type === "INITIALISE") {
    const { isAuthenticated, user, valunteers } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      valunteers,
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
  getVolunteer: () => Promise.resolve(),
});
// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { push } = useRouter();
  const [profile, setProfile] = useState(null);
  const [allVolunteer, setAllVolunteer] = useState(null);
  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          const userRef = doc(DB, "users", user.email);

          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const d = docSnap.data();
            d.displayName = `${Upper(d?.firstName)} ${Upper(d?.lastName)}`;
            setProfile(d);
          }

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
        push("/");
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

  const register = (email, password, firstName, lastName) =>
    createUserWithEmailAndPassword(AUTH, email, password)
      .then(async () => {
        email = email.toLowerCase();
        firstName = Upper(firstName);
        lastName = Upper(lastName);
        const userRef = doc(collection(DB, "users"), email);

        await setDoc(userRef, {
          email,
          firstName,
          lastName,
        });
        push("/");
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
  const getVolunteer = () => async () => {
    onAuthStateChanged(AUTH, async (user) => {
      if (user) {
        const volRef = await getDocs(collection(DB, "users", user?.email, "volunteers"));
        console.log("getPatients");
        const volunt = volRef?.docs?.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setAllVolunteer(volunt);
      }
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
          firstName: state?.user?.firstName || profile?.firstName,
          lastName: state?.user?.lastName || profile?.lastName,
          displayName: state?.user?.displayName || profile?.displayName,
        },
        valunteers: login,
        register,
        logout,
        getVolunteer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
