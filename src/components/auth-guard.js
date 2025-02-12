import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_API } from "../config";
export const AuthGuard = (props) => {
  const firebaseApp = initializeApp(FIREBASE_API);

  const AUTH = getAuth(firebaseApp);
  const { children } = props;
  const router = useRouter();

  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to login page.

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      // Prevent from calling twice in development mode with React.StrictMode enabled
      if (ignore.current) {
        return;
      }

      ignore.current = true;
      onAuthStateChanged(AUTH, async (user) => {
        if (!user) {
          console.log("Not authenticated, redirecting");
          router
            .replace({
              pathname: "/login",
              query: router.asPath !== "/" ? { continueUrl: router.asPath } : undefined,
            })
            .catch(console.error);
        } else {
          setChecked(true);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
