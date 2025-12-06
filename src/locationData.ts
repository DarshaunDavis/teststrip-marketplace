// src/locationData.ts

export type StateCode =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA"
  | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD"
  | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ"
  | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC"
  | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY";

export interface CityDef {
  id: string;   // slug (e.g., "new-york")
  name: string; // display name
}

export interface StateDef {
  code: StateCode;
  name: string;
  cities: CityDef[];
}

/**
 * 50 states + 1 major city each for now.
 * Super easy to extend later – just add more cities to any state.
 */
export const STATE_CITY_DATA: StateDef[] = [
  { code: "AL", name: "Alabama", cities: [{ id: "birmingham", name: "Birmingham" }] },
  { code: "AK", name: "Alaska", cities: [{ id: "anchorage", name: "Anchorage" }] },
  { code: "AZ", name: "Arizona", cities: [{ id: "phoenix", name: "Phoenix" }] },
  { code: "AR", name: "Arkansas", cities: [{ id: "little-rock", name: "Little Rock" }] },
  { code: "CA", name: "California", cities: [{ id: "los-angeles", name: "Los Angeles" }] },
  { code: "CO", name: "Colorado", cities: [{ id: "denver", name: "Denver" }] },
  { code: "CT", name: "Connecticut", cities: [{ id: "hartford", name: "Hartford" }] },
  { code: "DE", name: "Delaware", cities: [{ id: "wilmington", name: "Wilmington" }] },
  { code: "FL", name: "Florida", cities: [{ id: "miami", name: "Miami" }] },
  { code: "GA", name: "Georgia", cities: [{ id: "atlanta", name: "Atlanta" }] },
  { code: "HI", name: "Hawaii", cities: [{ id: "honolulu", name: "Honolulu" }] },
  { code: "ID", name: "Idaho", cities: [{ id: "boise", name: "Boise" }] },
  { code: "IL", name: "Illinois", cities: [{ id: "chicago", name: "Chicago" }] },
  { code: "IN", name: "Indiana", cities: [{ id: "indianapolis", name: "Indianapolis" }] },
  { code: "IA", name: "Iowa", cities: [{ id: "des-moines", name: "Des Moines" }] },
  { code: "KS", name: "Kansas", cities: [{ id: "wichita", name: "Wichita" }] },
  { code: "KY", name: "Kentucky", cities: [{ id: "louisville", name: "Louisville" }] },
  { code: "LA", name: "Louisiana", cities: [{ id: "new-orleans", name: "New Orleans" }] },
  { code: "ME", name: "Maine", cities: [{ id: "portland", name: "Portland" }] },
  { code: "MD", name: "Maryland", cities: [{ id: "baltimore", name: "Baltimore" }] },
  { code: "MA", name: "Massachusetts", cities: [{ id: "boston", name: "Boston" }] },
  { code: "MI", name: "Michigan", cities: [{ id: "detroit", name: "Detroit" }] },
  { code: "MN", name: "Minnesota", cities: [{ id: "minneapolis", name: "Minneapolis" }] },
  { code: "MS", name: "Mississippi", cities: [{ id: "jackson", name: "Jackson" }] },
  { code: "MO", name: "Missouri", cities: [{ id: "st-louis", name: "St. Louis" }] },
  { code: "MT", name: "Montana", cities: [{ id: "billings", name: "Billings" }] },
  { code: "NE", name: "Nebraska", cities: [{ id: "omaha", name: "Omaha" }] },
  { code: "NV", name: "Nevada", cities: [{ id: "las-vegas", name: "Las Vegas" }] },
  { code: "NH", name: "New Hampshire", cities: [{ id: "manchester", name: "Manchester" }] },
  { code: "NJ", name: "New Jersey", cities: [{ id: "newark", name: "Newark" }] },
  { code: "NM", name: "New Mexico", cities: [{ id: "albuquerque", name: "Albuquerque" }] },
  { code: "NY", name: "New York", cities: [{ id: "new-york", name: "New York" }] },
  { code: "NC", name: "North Carolina", cities: [{ id: "charlotte", name: "Charlotte" }] },
  { code: "ND", name: "North Dakota", cities: [{ id: "fargo", name: "Fargo" }] },
  { code: "OH", name: "Ohio", cities: [{ id: "columbus", name: "Columbus" }] },
  { code: "OK", name: "Oklahoma", cities: [{ id: "oklahoma-city", name: "Oklahoma City" }] },
  { code: "OR", name: "Oregon", cities: [{ id: "portland-or", name: "Portland" }] },
  { code: "PA", name: "Pennsylvania", cities: [{ id: "philadelphia", name: "Philadelphia" }] },
  { code: "RI", name: "Rhode Island", cities: [{ id: "providence", name: "Providence" }] },
  { code: "SC", name: "South Carolina", cities: [{ id: "charleston-sc", name: "Charleston" }] },
  { code: "SD", name: "South Dakota", cities: [{ id: "sioux-falls", name: "Sioux Falls" }] },
  { code: "TN", name: "Tennessee", cities: [{ id: "nashville", name: "Nashville" }] },
  { code: "TX", name: "Texas", cities: [{ id: "houston", name: "Houston" }] },
  { code: "UT", name: "Utah", cities: [{ id: "salt-lake-city", name: "Salt Lake City" }] },
  { code: "VT", name: "Vermont", cities: [{ id: "burlington", name: "Burlington" }] },
  { code: "VA", name: "Virginia", cities: [{ id: "richmond", name: "Richmond" }] },
  { code: "WA", name: "Washington", cities: [{ id: "seattle", name: "Seattle" }] },
  { code: "WV", name: "West Virginia", cities: [{ id: "charleston-wv", name: "Charleston" }] },
  { code: "WI", name: "Wisconsin", cities: [{ id: "milwaukee", name: "Milwaukee" }] },
  { code: "WY", name: "Wyoming", cities: [{ id: "cheyenne", name: "Cheyenne" }] },
];
