import React, { useCallback, useState } from "react";
import "../styles.css";

export default function LoginForm({
  email,
  setEmail,
  isLoading,
  setIsLoading,
  supabase,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const magicLinkLogin = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setSuccessMessage("Check your email for a Supabase Magic Link to Log In!");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error communicating with supabase. Please try again later");
    } finally {
      setIsLoading(false);
    }
  }, [email, supabase, isLoading]);

  return (
    <header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          magicLinkLogin();
        }}
      >
        <label>Enter an email</label>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
          className="picture-input"
        ></input>
        <div className="form-button">
          <button type="submit" disabled={isLoading || !email}>
            {isLoading ? "Sending..." : "Get Magic Link"}
          </button>
        </div>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </header>
  );
}
//