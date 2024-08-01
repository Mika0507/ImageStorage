import "./App.css";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import "./styles.css";
import UserDashboard from "./components/UserDashboard";
import LoginForm from "./components/LoginForm";
import Header from "./components/Header";
import Footer from "./components/Footer";

const CDNURL =process.env.REACT_APP_CDNURL;

function App() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();

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

  return (
    <div className="App">
      <div className="container">
        <Header />
        {user ? (
          <UserDashboard
            user={user}
            images={images}
            CDNURL={CDNURL}
            getImages={getImages}
            setImages={setImages}
          />
        ) : (
          <LoginForm
            email={email}
            setEmail={setEmail}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            supabase={supabase}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
