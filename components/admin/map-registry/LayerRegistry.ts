export interface MapLayerDefinition {
  id: string;
  name: string;
  generateLayer: (data: any, options?: any) => any; 
}

class LayerRegistry {
  private layers = new Map<string, MapLayerDefinition>();

  register(layer: MapLayerDefinition) {
    this.layers.set(layer.id, layer);
  }

  get(id: string) {
    return this.layers.get(id);
  }

  getAll() {
    return Array.from(this.layers.values());
  }
}

export const layerRegistry = new LayerRegistry();
