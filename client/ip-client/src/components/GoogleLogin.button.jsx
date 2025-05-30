import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function GoogleButton() {
  const navigate = useNavigate();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        console.log("Encoded JWT ID token: " + response.credential);

        try {
          // Fixed: Use correct endpoint and request body format
          const { data } = await axios.post(
            "http://localhost:3000/google-login",
            {
              id_token: response.credential, // Changed from 'googleToken' to 'id_token'
            }
          );

          console.log("Login successful:", data);
          localStorage.setItem("access_token", data.access_token);

          // Redirect to home page after successful login
          navigate("/");
          
        } catch (error) {
          console.error(
            "Google login failed:",
            error.response?.data || error.message
          );
          // Handle login error (show error message to user)
        }
      },
    });

    window.google.accounts.id.renderButton(
      // The ID of the HTML element where the button will be rendered
      document.getElementById("buttonDiv"),
      // Customize the button attributes
      { theme: "outline", size: "large" }
    );
    window.google.accounts.id.prompt();
  }, [navigate]);

  return (
    <div>
      <div className="w-60 mx-auto" id="buttonDiv"></div>
    </div>
  );
}
