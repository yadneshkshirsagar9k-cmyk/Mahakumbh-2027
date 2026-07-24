export const roadNetworkService = {
  getMajorRoutes: async () => {
    // Mock GeoJSON for Nashik major routes
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { id: "route-1", name: "Nashik Freeway" },
          geometry: {
            type: "LineString",
            coordinates: [
              [73.7800, 19.9900],
              [73.7900, 20.0000],
              [73.8000, 20.0100]
            ]
          }
        }
      ]
    };
  }
};
