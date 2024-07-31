import "./App.css";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import './styles.css';

// https://jdapezhjjsgxcgdlwrhh.supabase.co/storage/v1/object/public/pickeeper_images/474713b4-6b24-45f7-9b57-5190c92ea635/20d2450f-b299-4935-8e65-cc0b5ec5e103

const CDNURL =
  "https://jdapezhjjsgxcgdlwrhh.supabase.co/storage/v1/object/public/pickeeper_images/";

function App() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();

  // console.log(email);

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("pickeeper_images")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null) {
      setImages(data);
    } else {
      alert("Error loading images");
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  const magicLinkLogin = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for a Supabase Magic Link to Log In!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error communicating with supabase. Please try again later");
    } finally {
      setIsLoading(false);
    }
  }, [email, supabase, isLoading]);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  async function uploadImage(event) {
    let file = event.target.files[0];

    const { data, error } = await supabase.storage
      .from("pickeeper_images")
      .upload(user.id + "/" + uuidv4(), file);

    if (data) {
      getImages();
    } else {
      console.log(error);
    }
  }

  async function deleteImage(imageName) {
    const { error } = await supabase.storage
      .from("pickeeper_images")
      .remove([user.id + "/" + imageName]);

    if (error) {
      alert(error);
    } else {
      getImages();
    }
  }

  return (
    <div className="App">
      <div className="container">
        {user === null ? (
          <header>
            <h1>Welcome to ImageWall</h1>
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
              ></input>
              <button type="submit" disabled={isLoading || !email}>
                {isLoading ? "Sending..." : "Get Magic Link"}
              </button>
            </form>
          </header>
        ) : (
          <header>
            <h1>Your ImageWall</h1>
            <button onClick={() => signOut()}>Sign Out</button>
            <p>Current user: {user.email}</p>
            <p>
              Use the Choose file button below to upload an image to your
              gallery
            </p>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(event) => uploadImage(event)}
            />
            <hr />
            <h3>Your Pictures</h3>
            <div>
              {images.map((image) => {
                return (
                  <div key={CDNURL + user.id + "/" + image.name}>
                    <img src={CDNURL + user.id + "/" + image.name} />
                    <button onClick={() => deleteImage(image.name)}>
                      Delete image
                    </button>
                  </div>
                );
              })}
            </div>
          </header>
        )}
      </div>
    </div>
  );
}

export default App;
