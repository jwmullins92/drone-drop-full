import React, { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl';

function MapVerifier(props) {



    const [viewState, setViewState] = React.useState({
        longitude: props.longitude,
        latitude: props.latitude,
        zoom: 16,
        attributionControl: false,
    });

    useEffect(() => {
        setViewState({
            longitude: props.longitude,
            latitude: props.latitude,
            zoom: 16,
            attributionControl: false,
        })
    }, [props.longitude, props.latitude])
    return (
        <div>
            <div className="map-container">
                <Map
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                >
                    <Marker longitude={props.longitude} latitude={props.latitude} />
                </Map>
            </div>
        </div >


    );
}

export default MapVerifier