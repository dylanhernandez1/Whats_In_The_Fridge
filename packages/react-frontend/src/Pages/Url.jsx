const LOCAL_URL = "http://localhost:8000";
const PRODUCTION_URL = "localhost:8000";

const URL =
  import.meta.env.MODE === "development"
    ? LOCAL_URL
    : PRODUCTION_URL;

export default URL;
