import { useEffect } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        console.log("Encoded JWT ID token: " + response.credential);

        const { data } = await axios.post("http://localhost:3000/auth/google", {
          googleToken: response.credential,
        });
        localStorage.setItem("access_token", data.access_token);
      },
    });

    window.google.accounts.id.renderButton(
      // The ID of the HTML element where the button will be rendered
      document.getElementById("buttonDiv"),
      // Customize the button attributes
      { theme: "outline", size: "large" }
    );
    window.google.accounts.id.prompt();
  }, []);

  return <div id="buttonDiv"></div>;
}

export default App;
