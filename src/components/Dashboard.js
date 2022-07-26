import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useAuth } from "./Firebase/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import Notifications from "./Notifications";
import { onMessageListener } from "./Firebase/Firebase";
import { Toast, Table } from "react-bootstrap";
import * as api from './YelpApi/api'
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css'
import Tables from './Tables'

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
import "@reach/combobox/styles.css";

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

  //use state returns an array, we return the first two items
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [amountResults, setAmountResults] = useState();

  // const [businesses, amountResults, searchParams, setSearchParams] = UseBusinessSearch("restaurants", 37.400142, -121.8723015)

  const fetchData = async (term, latitude, longitude) => {
    try {
      const rawData = await api.get("/businesses/search", {
        term,
        latitude,
        longitude,
      });
      const resp = await rawData.json();
      console.log("This is resp", resp);
      setBusinesses(resp.businesses);
      setAmountResults(resp.total);
    } catch (err) {
      console.log(err);
    }
  };

  //use this to prevent re-renders
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  //panTo
  const panTo = React.useCallback(
    ({ lat, lng }) => {
      console.log(lat, lng);
      setLat(lat);
      setLong(lng);
      mapRef.current.setZoom(14);
      fetchData("restaurant", lat, lng);
      console.log(businesses);
      console.log(amountResults);
    },
    [lat, long]
  );

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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((businesses, i) => (
          
            <tr>
              <th>{businesses.name}</th>
              <th>
                <a href={businesses.url}>
                  Click Me to go to Yelp!
                </a>
              </th>
              <th>
                <img src={businesses.image_url}></img>
              </th>
            </tr>
          ))}
        </tbody>
      </Table>
      <Notifications />
      {show ? (
        <Toast
          onClose={() => setShow(false)}
          show={show}
          delay={10000}
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
      <h1>
        {lat}
        {long}
      </h1>
      <NavBar />
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
      <Button onClick={handleLogOut}>Log Out</Button>
    </div>
  );
}

//returns the lat lng of the user's position
function Locate({ panTo }) {
  return (
    <Button
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
      Get Current Location!
    </Button>
    
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

  //input from user is handled here
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
          placeholder="Input your destination"
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
