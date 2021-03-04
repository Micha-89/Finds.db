import React, { useState } from 'react';
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import axios from 'axios';

export default function Locations(props) {

  const [locations, setLocations] = useState([])

    function mapLoad() {
      axios.get('/api/locations')
      .then(response => {
        setLocations(response.data)
      })
    }

  const [viewport, setViewport] = useState({
    latitude: 51.048896,
    longitude: 3.629286,
    width: "100vw",
    height: "93vh",
    zoom: 13
  })

  const [newMarkerLocation, setNewMarkerLocation] = useState({
    latitude: 0,
    longitude: 0
  })

  function mapOnClick(event) {
    setNewMarkerLocation({
      latitude: event.lngLat[1],
      longitude: event.lngLat[0]
    })
  }

  function addLocation(e) {
    e.preventDefault();
    axios.post('/api/locations', {
      longitude: newMarkerLocation.longitude,
      latitude: newMarkerLocation.latitude,
      hunts: []
    })
    .then(response => {
      setNewMarkerLocation({
        latitude: 0,
        longitude: 0
      })
      axios.get('/api/locations')
      .then(response => {
        setLocations(response.data)
      })

    })
  }

  const [selectedMarker, setSelectedMarker] = useState(null);
  
  function deleteLocation(e) {
    e.preventDefault();
    axios.delete(`/api/locations/${selectedMarker._id}`)
    .then(() => {
      setSelectedMarker(null)
      axios.get('/api/locations')
      .then(response => {
        setLocations(response.data)
      })
    })
    .catch(err => {
      console.log(err)
    })

  }

  return (
    <div>
      <ReactMapGL 
        onLoad={mapLoad}
        {...viewport} 
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} 
        onViewportChange={viewport => {setViewport(viewport)}}  
        mapStyle='mapbox://styles/mapbox/satellite-v9'
        onClick={mapOnClick}
      >
        {locations.length > 0 ? locations.filter(location => location.owner === props.user._id).map(
          location => (
          <Marker 
            key={location._id}
            latitude={location.latitude} 
            longitude={location.longitude} 
            offsetTop={-54} 
            offsetLeft={-25}
          >
              <img 
                src="/pin.svg" 
                alt="marker" 
                className="markerButton" 
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedMarker(location)
                }}
              />
            
          </Marker>
        )) : <></>}

        {(newMarkerLocation.longitude !== 0) ? (
          <Popup 
          latitude={newMarkerLocation.latitude} 
          longitude={newMarkerLocation.longitude}
          >
            <form onSubmit={addLocation} style={{margin:"12px"}}>
              <button type="submit">Add Location</button>
            </form>
          </Popup>
        ) : <></> }

        {(selectedMarker !== null) ? (
          <Popup 
          latitude={selectedMarker.latitude} 
          longitude={selectedMarker.longitude}
          >
            <div style={{margin:"12px"}}>
              <p>Sessions: {selectedMarker.hunts.length}</p>
              <button>Add session</button>
              {(selectedMarker.hunts.length > 0) ? <button>Sessions</button> : <></>}
              {(selectedMarker.hunts.length === 0) ? 
              <form onSubmit={deleteLocation}>
                <button type="submit">Delete location</button>
              </form> : <></>}
            </div>
          </Popup>
        ) : <></> }

      </ReactMapGL>
    </div>
  )
}

