const LOCAL_URL = "http://localhost:8000";
const PRODUCTION_URL =
  "https://whats-in-the-fridge-e2f8g5etfbarcmdk.westus-01.azurewebsites.net";

const URL =
  import.meta.env.MODE === "development"
    ? LOCAL_URL
    : PRODUCTION_URL;

export default URL;
