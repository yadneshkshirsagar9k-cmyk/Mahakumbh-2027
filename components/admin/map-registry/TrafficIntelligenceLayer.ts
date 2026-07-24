import { PathLayer } from '@deck.gl/layers';
import { layerRegistry } from './LayerRegistry';
import { UnifiedTrafficSegment } from '@/types/command-centre';

layerRegistry.register({
  id: 'traffic-intelligence',
  name: 'Live Traffic Intelligence',
  generateLayer: (data: UnifiedTrafficSegment[]) => {
    return new PathLayer({
      id: 'traffic-intelligence',
      data,
      getPath: (d: UnifiedTrafficSegment) => d.path,
      getColor: (d: UnifiedTrafficSegment) => {
        if (d.speed > 40) return [0, 255, 0]; // Green - Fast
        if (d.speed > 20) return [255, 255, 0]; // Yellow - Moderate
        if (d.speed > 10) return [255, 165, 0]; // Orange - Heavy
        return [255, 0, 0]; // Red - Congested
      },
      getWidth: 10,
      widthMinPixels: 4
    });
  }
});
