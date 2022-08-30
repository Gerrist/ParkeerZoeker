import styled from "styled-components";
import {MapContainer, Marker, Polygon, Popup, TileLayer} from "react-leaflet";
import React from "react";
import Facility from "../../../shared/types/Facility";

const LeafletContainer = styled(MapContainer)`
  height: 100vh;
`;

const FacilitiesMap = ({ facilities }: {
    facilities: Facility.BaseFacility[];
}) => {
    return (
        <LeafletContainer center={[51.98507139487303, 5.908378522149942]} zoom={13} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            />
            {
                facilities.map(facility => {
                    return (
                        <>
                            <Marker key={facility.uuid + "-marker"} position={[facility.location.lat, facility.location.lon]}>
                                <Popup>
                                    {facility.name}
                                </Popup>
                            </Marker>
                            {
                                facility.area && (
                                    <Polygon key={facility.uuid + "-area"} positions={facility.area}>
                                        <Popup>
                                            {facility.name}
                                        </Popup>
                                    </Polygon>
                                )
                            }
                        </>
                    );
                })
            }
        </LeafletContainer>
    )
};

export default FacilitiesMap;