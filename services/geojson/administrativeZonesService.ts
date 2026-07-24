export const administrativeZonesService = {
  getZones: async () => {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { id: "zone-a", name: "Panchavati Zone" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [73.77, 19.98],
                [73.81, 19.98],
                [73.81, 20.02],
                [73.77, 20.02],
                [73.77, 19.98]
              ]
            ]
          }
        }
      ]
    };
  }
};
