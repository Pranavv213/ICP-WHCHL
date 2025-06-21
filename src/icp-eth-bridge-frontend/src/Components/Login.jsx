import React, { useState } from "react";
import { AuthClient } from "@dfinity/auth-client";

function Login() {
  const [principal, setPrincipal] = useState("");

  const handleShowPrincipal = async () => {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();
      setPrincipal(principal.toString());
    } else {
      await new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: "https://identity.ic0.app",
          onSuccess: resolve,
          onError: reject,
        });
      });
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();
      setPrincipal(principal.toString());
    }
  };

  return (
    <div>
      <button onClick={handleShowPrincipal}>Show My Principal</button>
      {principal && <div>Your Principal: {principal}</div>}
    </div>
  );
}

export default Login;