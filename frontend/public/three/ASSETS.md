# 3D scene asset provenance

- `land.geojson`: Natural Earth 1:110m land polygons, public domain. Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson . Terms: https://www.naturalearthdata.com/about/terms-of-use/ .
- `src/components/three/world/land-points.json`: 5,610 latitude/longitude samples derived from those polygons for the globe. The runtime imports these points and makes no external map request.
- Island, warehouse, factory, cranes, containers, ship, vehicles, roads, vegetation, globe network, textures and cloud sprites: original procedural assets authored in `buildWorld.ts` for this project. No purchased, scraped or third-party GLB models, photos or HDR images are included.
- Cloud sprites are generated from a sampled density field with baked self-shadowing; they are not extracted from the user's reference image. The scene remains genuine interactive WebGL geometry.
- Three.js, React Three Fiber and Drei use MIT licenses; their distributed license files remain in their npm packages. Natural Earth data attribution is provided here although its public-domain terms do not require it.

The user's reference image is a visual guide only and is not shipped as a hero image or background.
