import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import useValidateToken from "../../hooks/useValidateToken";
import "./PlayerPage.css"; // Import the CSS file

function PlayerPage() {
  const navigate = useNavigate();
  const isValidToken = useValidateToken(); // Use the custom hook for token validation
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (isValidToken === null) return; // Wait for token validation
    if (!isValidToken) {
      navigate("/login");
      return;
    }

    // Proceed with socket connection if token is valid
    const socket = io("http://localhost:5000", {
      extraHeaders: {
        authorization: `Bearer ${token}`, // Send the token to the backend
      },
    });

    // Socket event listeners
    socket.on("navigateToLivePage", (msg) => {
      console.log("Received navigateToLivePage event, redirecting to live page...");
      navigate("/player/live", { state: { hash: msg.hash } });
    });

    socket.on("sessionEnded", () => {
      console.log("Received sessionEnded event, redirecting to player page...");
      navigate("/player");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      navigate("/login");
    });

    socket.on("disconnect", (error) => {
      console.error("Socket disconnected:", error);
      navigate("/login");
    });

    // Cleanup on component unmount
    return () => {
      socket.off("navigateToLivePage");
      socket.off("sessionEnded");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [isValidToken, navigate, token]);

  return (
    <div className="player-page">
      <h2>Waiting for next song</h2>
      <button className="return-button" onClick={() => navigate("/")}>
        Return to Main Page
      </button>
    </div>
  );
}

export default PlayerPage;
