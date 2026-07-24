import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { layerRegistry } from './LayerRegistry';
import { PredictedCrowdPoint } from '@/types/command-centre';

layerRegistry.register({
  id: 'predictive-crowd',
  name: 'Predictive Crowd Congestion',
  generateLayer: (data: PredictedCrowdPoint[]) => {
    return new HeatmapLayer({
      id: 'predictive-crowd',
      data,
      getPosition: (d: PredictedCrowdPoint) => d.coordinates,
      getWeight: (d: PredictedCrowdPoint) => d.weight,
      radiusPixels: 60,
      intensity: 1,
      threshold: 0.1,
      opacity: 0.6, 
      colorRange: [
        [0, 255, 255, 100],     
        [0, 0, 255, 100],       
        [138, 43, 226, 100]     
      ]
    });
  }
});
