const LOCAL_URL = "http://localhost:5173";
const PRODUCTION_URL =
  "https://white-stone-02cbbab1e.6.azurestaticapps.net";

const URL =
  import.meta.env.MODE === "development"
    ? LOCAL_URL
    : PRODUCTION_URL;

export default URL;
