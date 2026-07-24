import { ScatterplotLayer } from '@deck.gl/layers';
import { layerRegistry } from './LayerRegistry';
import { UnifiedIncident } from '@/types/command-centre';

layerRegistry.register({
  id: 'emergency-intelligence',
  name: 'Emergency Intelligence',
  generateLayer: (data: UnifiedIncident[], options: { time: number }) => {
    const time = options?.time || 0;
    const pulse = (Math.sin(time * 3) + 1) / 2; // 0 to 1

    return new ScatterplotLayer({
      id: 'emergency-intelligence',
      data,
      getPosition: (d: UnifiedIncident) => d.coordinates,
      getFillColor: [255, 0, 0, 255],
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 2,
      getRadius: (d: UnifiedIncident) => 50 + pulse * 50,
      radiusMinPixels: 10,
      updateTriggers: {
        getRadius: [time]
      }
    });
  }
});
