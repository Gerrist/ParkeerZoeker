import {ParkingFacilityType} from "./parkingFacilityType";

export type ParkingFacility = {
    identifier: string;
    name: string;
    hasDynamicData: boolean;
    location: {
        lat: number;
        lon: number;
    };
    address: string;
    type: string;
    static: {
        electric?: {
            total: number;
        }
        normal?: {
            total: number;
        }
    };
    dynamic?: {
        electric?: {
            total: number;
            free?: number;
        }
        normal?: {
            total: number;
            free?: number;
        }
    };
    geometry?: [number, number][];

}
