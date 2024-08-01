import React from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import "../styles.css";

export default function UserDashboard({ user, images, CDNURL, getImages }) {
  const supabase = useSupabaseClient();

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
    <header>
      <div className="sign-out">
        <p>Current user: {user.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
      <div className="picture-selected">
        <p>
          Use the Choose file button below to upload an image to your gallery
        </p>
        <input
          className="picture-input-select"
          type="file"
          accept="image/png, image/jpeg"
          onChange={(event) => uploadImage(event)}
        />
      </div>

      <hr />
      <h1>
        <span className="title-1">Welcome</span> <span className="title-2">to</span> <span className="title-3">your </span>   
        <span className="title-4">Pickeeper </span>  
        <span className="title-5">wall!</span>
      </h1>
      <div className="pickeeper-grid">
        {images.map((image) => {
          return (
            <div
              className="pictures-card"
              key={CDNURL + user.id + "/" + image.name}
            >
              <img src={CDNURL + user.id + "/" + image.name} />
              <button onClick={() => deleteImage(image.name)}>
                Delete image
              </button>
            </div>
          );
        })}
      </div>
    </header>
  );
}
