// build-zipcodes-json.cjs
// Build a simple ZIP list from the 2023_Gaz_zcta_national.txt file.
//
// Input:  2023_Gaz_zcta_national.txt  (tab-separated, from Census)
// Output: us-zipcodes.json            (array of { zip, lat, lng })

const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(__dirname, "2023_Gaz_zcta_national.txt");
const OUTPUT_FILE = path.join(__dirname, "us-zipcodes.json");

function main() {
  console.log("Reading:", INPUT_FILE);
  const raw = fs.readFileSync(INPUT_FILE, "utf8");

  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    throw new Error("Gazetteer file is empty");
  }

  // Split on tabs, trim, and drop empty trailing cells
  let header = lines[0].split("\t").map((h) => h.trim());
  header = header.filter((h) => h.length > 0);

  console.log("Header:", header);

  const geoidIdx = header.indexOf("GEOID");
  const latIdx = header.indexOf("INTPTLAT");
  const lngIdx = header.indexOf("INTPTLONG");

  if (geoidIdx === -1 || latIdx === -1 || lngIdx === -1) {
    throw new Error(
      "Unexpected header format in Gazetteer file. Header was: " +
        JSON.stringify(header)
    );
  }

  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split("\t").map((c) => c.trim());
    if (cols.length <= Math.max(geoidIdx, latIdx, lngIdx)) continue;

    const geoid = cols[geoidIdx];
    if (!geoid) continue;

    const lat = parseFloat(cols[latIdx]);
    const lng = parseFloat(cols[lngIdx]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

    rows.push({
      zip: geoid, // keep as string so leading zeros are preserved
      lat,
      lng,
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(rows, null, 2));
  console.log(`Wrote ${rows.length} ZIPs to ${OUTPUT_FILE}`);
}

main();
