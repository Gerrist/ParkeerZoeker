namespace Facility {
    export type BaseFacility = {
        uuid: string;
        name: string;
        address: string;
        type: "parking_garage" | "parking_lot" | "onstreet_parking";
        rate: {
            amount_fractional: number;
            unit: string;
        };
        location: {
            lat: number;
            lon: number;
        };
        area?: [number, number][];
    }
}

export default Facility;