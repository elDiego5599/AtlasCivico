/**
 * Scale up San Andrés y Providencia coordinates in the TopoJSON
 * to make the islands more visible on the national map.
 *
 * Usage: node scripts/scale-san-andres.js
 */
const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "../public/Colombia_departamentos_municipios_poblacion-topov2.json");
const OUTPUT = path.join(__dirname, "../public/Colombia_departamentos_municipios_poblacion-topov2.json");
const SCALE_FACTOR = 6;
const TARGET_NAME = "ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA";

const topo = JSON.parse(fs.readFileSync(INPUT, "utf8"));
const arcs = topo.arcs;
const transform = topo.transform;

// Helper: decode arc (quantized coordinates)
function decodeArc(arc) {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x, y];
  });
}

// Helper: encode arc back
function encodeArc(decoded) {
  const arc = [];
  let px = 0, py = 0;
  for (const [x, y] of decoded) {
    arc.push([x - px, y - py]);
    px = x;
    py = y;
  }
  return arc;
}

// Find the San Andrés object
const dptos = topo.objects.MGN_ANM_DPTOS;
if (!dptos || dptos.type !== "GeometryCollection") {
  console.error("Invalid TopoJSON structure");
  process.exit(1);
}

const geometries = dptos.geometries;
const saIndex = geometries.findIndex(
  (g) => g.properties && g.properties.DPTO_CNMBR === TARGET_NAME
);

if (saIndex === -1) {
  console.error("San Andrés not found in geometries");
  process.exit(1);
}

console.log(`Found "${TARGET_NAME}" at index ${saIndex}`);
console.log(`Geometry type: ${geometries[saIndex].type}`);

// Decode all arcs referenced by San Andrés
const saGeom = geometries[saIndex];
let allArcIndices = [];

if (saGeom.type === "MultiPolygon") {
  allArcIndices = saGeom.arcs.flat(2);
} else if (saGeom.type === "Polygon") {
  allArcIndices = saGeom.arcs.flat();
}

// Decode all arcs
const decodedArcs = new Map();
allArcIndices.forEach((idx) => {
  if (!decodedArcs.has(idx)) {
    const arcIdx = idx < 0 ? ~idx : idx;
    decodedArcs.set(idx, decodeArc(arcs[arcIdx]));
  }
});

// Find bounds of decoded arcs
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
decodedArcs.forEach((pts) => {
  pts.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });
});

const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
console.log(`Bounds (quantized): ${minX},${minY} to ${maxX},${maxY}`);
console.log(`Centroid (quantized): ${cx}, ${cy}`);

// Scale coordinates from centroid
decodedArcs.forEach((pts, key) => {
  const scaled = pts.map(([x, y]) => {
    const nx = cx + (x - cx) * SCALE_FACTOR;
    const ny = cy + (y - cy) * SCALE_FACTOR;
    return [Math.round(nx), Math.round(ny)];
  });
  decodedArcs.set(key, scaled);
});

// Now we need to re-encode arcs. This is complex because TopoJSON uses shared arcs.
// Simpler approach: just replace the quantized coordinates in the original arcs.

// Since we're modifying shared arcs, we need to be careful.
// Let's use a different approach: modify the quantized coordinates directly.

// Re-decode each arc, scale, re-encode
allArcIndices.forEach((idx) => {
  const arcIdx = idx < 0 ? ~idx : idx;
  const original = arcs[arcIdx];
  const decoded = decodeArc(original);

  // Scale
  const scaled = decoded.map(([x, y]) => {
    const nx = cx + (x - cx) * SCALE_FACTOR;
    const ny = cy + (y - cy) * SCALE_FACTOR;
    return [Math.round(nx), Math.round(ny)];
  });

  // Re-encode
  arcs[arcIdx] = encodeArc(scaled);
});

console.log(`\nScaled ${decodedArcs.size} arcs by ${SCALE_FACTOR}x`);

// Write output
fs.writeFileSync(OUTPUT, JSON.stringify(topo));
console.log(`Written to ${OUTPUT}`);

// Verify: decode scaled arcs and show new bounds
let vMinX = Infinity, vMaxX = -Infinity, vMinY = Infinity, vMaxY = -Infinity;
allArcIndices.forEach((idx) => {
  const arcIdx = idx < 0 ? ~idx : idx;
  const decoded = decodeArc(arcs[arcIdx]);
  decoded.forEach(([x, y]) => {
    if (x < vMinX) vMinX = x;
    if (x > vMaxX) vMaxX = x;
    if (y < vMinY) vMinY = y;
    if (y > vMaxY) vMaxY = y;
  });
});
console.log(`New bounds (quantized): ${vMinX},${vMinY} to ${vMaxX},${vMaxY}`);
