import { Button, TextField } from "@material-ui/core";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import React, { useState } from "react";
import "../styles.css";
function PageLogin() {
  const [customerId, setCustomerIdState] = useState("");
  const handleGoogleSignIn = (firebase) => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(googleAuthProvider)
      .then((loginInfo) => {
        console.log(loginInfo);
        const db = firebase.firestore();
        db.collection("/info")
          .doc("users")
          .set({ [loginInfo.user.email]: customerId }, { merge: true });
      });
  };

  return (
    <div className="PageLogin">
      <h1>Login</h1>
      <TextField
        label="Müşteri Kodu"
        value={customerId}
        onChange={(event) => {
          setCustomerIdState(event.target.value);
        }}
      />
      <FirebaseAuthConsumer>
        {({ firebase }) => (
          <Button
            disabled={!customerId}
            variant="contained"
            color="primary"
            onClick={() => handleGoogleSignIn(firebase)}
          >
            Sign in with Google
          </Button>
        )}
      </FirebaseAuthConsumer>
    </div>
  );
}

export default PageLogin;
