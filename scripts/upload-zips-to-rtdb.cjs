// upload-zips-to-rtdb.cjs
// CommonJS script to upload us-zipcodes.json into Realtime Database

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

// 1. Load service account
const serviceAccount = require("./serviceAccountKey.json");

// 2. Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // 👇 This is the RTDB URL you showed in your screenshot
  databaseURL:
    "https://test-strip-marketplace-a1f47-default-rtdb.firebaseio.com",
});

const db = admin.database();

// 3. Load ZIP data
const ZIP_PATH = path.join(__dirname, "us-zipcodes.json");
console.log("Reading:", ZIP_PATH);

const raw = fs.readFileSync(ZIP_PATH, "utf8");
const zipMap = JSON.parse(raw); // { "00501": { lat, lng, state, city }, ... }

const entries = Object.entries(zipMap); // [ [zip, data], ... ]
console.log(`Uploading ${entries.length} ZIP codes to RTDB...`);

// 4. Upload in batches to avoid huge single update
async function main() {
  const BATCH_SIZE = 500;
  const ref = db.ref("zipcodes");

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const slice = entries.slice(i, i + BATCH_SIZE);
    const batchPayload = {};

    for (const [zip, data] of slice) {
      // each ZIP becomes: zipcodes/{zip} -> { ...data }
      batchPayload[zip] = data;
    }

    console.log(
      `Uploading ZIPs ${i + 1}–${i + slice.length} of ${entries.length}...`
    );
    await ref.update(batchPayload);
  }

  console.log("✅ Done! All ZIP codes uploaded to Realtime Database.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
