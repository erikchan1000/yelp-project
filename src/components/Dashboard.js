import React from "react";
import NavBar from "./NavBar";
import { useAuth } from "./Firebase/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import Notifications from "./Notifications";
import { onMessageListener } from "./Firebase/Firebase";
import { Toast } from "react-bootstrap";
import MapStyles from "../MapStyles";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "500px",
  height: "500px",
};
const center = {
  lat: 43,
  lng: -79,
};
const options = {
  styles: MapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { currentUser, logout } = useAuth();
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });

  {
    /* take this out after project completion */
  }
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCPt4cYU7eDJf5TKmAsLesZQsP9t9Kahjc",
    libraries,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  console.log(show, notification);

  onMessageListener()
    .then((payload) => {
      setShow(true);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      console.log("payload: ", payload);
    })
    .catch((err) => {
      console.log(err);
    });

  async function handleLogOut() {
    setError(null);

    try {
      await logout();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      {show ? (
        <Toast
          onClose={() => setShow(false)}
          show={show}
          delay={109000}
          autohide
          animation
          style={{
            position: "absolute",
            top: 20,
            right: 20,
          }}
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="shift">{notification.title}</strong>
            <small className="shift">Now</small>
          </Toast.Header>
          <Toast.Body>{notification.body}</Toast.Body>
        </Toast>
      ) : (
        <></>
      )}
      <NavBar />

      {/* Map displays here :) 
          Trying to figure out how to interface with the API,
          I think I'll need a search menu so people can look for what they want,
          then pan to the user's specified address and return the cuisines via the
          API */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
      ></GoogleMap>

      {error && <Alert variant="danger">{error}</Alert>}
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
}
