import Facility from "../../../shared/types/Facility"; // Todo: Replace with alias

namespace API {
    export const getLocalParkingFacilities = async ({ lat, lon }) => {
        return new Promise<Facility.BaseFacility[]>((resolve, reject) => {
            resolve([
                {
                    uuid: "1",
                    name: "Musisgarage",
                    address: "Velperbinnensingel 2, 6811 BP Arnhem",
                    type: "parking_garage",
                    rate: {
                        amount_fractional: 65,
                        unit: "quarter_hour"
                    },
                    location: {
                        lat: 51.982688686277676,
                        lon: 5.912684470537507
                    },
                },
                {
                    uuid: "2",
                    name: "Parkeergarage Centraal",
                    address: "Willemstunnel 1, 6811 KZ Arnhem",
                    type: "parking_garage",
                    rate: {
                        amount_fractional: 120,
                        unit: "half_hour"
                    },
                    location: {
                        lat: 51.98371950604971,
                        lon: 5.901607523193393
                    },
                },
                {
                    uuid: "3",
                    name: "Van Lawick van Pabststraat",
                    address: "Van Lawick van Pabststraat 116-152, 6814 JV Arnhem",
                    type: "onstreet_parking",
                    rate: {
                        amount_fractional: 36,
                        unit: "half_hour"
                    },
                    location: {
                        lat: 51.9899284836356,
                        lon: 5.8936797608866565
                    },
                    area: [
                            [
                                51.99052264228366,
                                5.892131924629211
                            ],
                            [
                                51.99018569781636,
                                5.8928292989730835
                            ],
                            [
                                51.989904908823576,
                                5.893510580062865
                            ],
                            [
                                51.9895580494017,
                                5.894363522529602
                            ],
                            [
                                51.98903940696845,
                                5.895683169364929
                            ],
                            [
                                51.98914181454904,
                                5.895763635635376
                            ],
                            [
                                51.98922440113699,
                                5.895527601242065
                            ],
                            [
                                51.98964063522203,
                                5.895527601242065
                            ],
                            [
                                51.989637331792146,
                                5.895264744758606
                            ],
                            [
                                51.98960429747986,
                                5.894599556922912
                            ],
                            [
                                51.9902715858625,
                                5.892984867095947
                            ],
                            [
                                51.990608529683556,
                                5.892260670661926
                            ],
                            [
                                51.99052264228366,
                                5.892131924629211
                            ]
                        ]
                },
            ]);
        });
    }
}

export default API;