import React from "react";
import NavBar from "./NavBar";
import { useAuth } from "./Firebase/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import Notifications from "./Notifications";
import { onMessageListener } from "./Firebase/Firebase";
import { Toast } from "react-bootstrap";

//imports for the map
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

//constants for the map
const libraries = ["places"];
const mapContainerStyle = {
  width: "500px",
  height: "500px",
};
//NYC is hardcoded in for now
const center = {
  lat: 40.73061,
  lng: -73.935242,
};
const options = {
  //styles: MapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { currentUser, logout } = useAuth();
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });

  //take out key after project completion
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCPt4cYU7eDJf5TKmAsLesZQsP9t9Kahjc",
    libraries,
  });

  //have to set these to the api info, state to set map markers
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  //use this to prevent re-renders
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  //panTo
  const panTo = React.useCallback(({ lat, lng }) => {
    console.log(lat, lng);
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  //console.log(show, notification);

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

      <Search panTo={panTo} />
      <Locate panTo={panTo} />

      {/* Map displays here
          Trying to figure out how to interface with the API,
          I think I'll need a search menu so people can look for what they want,
          then pan to the user's specified address and return the cuisines via the
          API */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {/* Need to add markers here */}
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {/* business name here */}
        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div></div>
          </InfoWindow>
        ) : null}
      </GoogleMap>

      {error && <Alert variant="danger">{error}</Alert>}
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
}

//returns the lat lng of the user's position
function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="../public/compass.svg" alt="compass" />
    </button>
  );
}

//DONE
function Search({ panTo }) {
  const {
    ready, //to see if the script can load the values, handled by useLoad Script
    value, //what is the current value the user has typed so far
    suggestions: { status, data }, //suggestions from google's api
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 40.73061, lng: () => -73.935242 },
      radius: 200 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  //DONE
  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
