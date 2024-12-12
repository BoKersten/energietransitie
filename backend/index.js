import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Optional: If you want to allow CORS for your own proxy
// Ensure this is installed via `npm install node-fetch`
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes (optional)
app.use(cors());
app.use(express.json());
app.get("/api/tariffs", async (req, res) => {
  const startTimestamp = req.query.startTimestamp;
  const endTimestamp = req.query.endTimestamp;
  const url = `https://mijn.easyenergy.com/nl/api/tariff/getapxtariffs?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&grouping=&includeVat=true`;

  try {
    const response = await fetch(url); // Using the native fetch
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.post("/api/consumption", async (req, res) => {
  const { TG, Q, SQ, SP, NG, RH, FHVEC, FXX, DDVEC, PG } = req.body;

  const externalUrl =
    "https://api.obviously.ai/v3/model/automl/predict/single/0f110a80-aa7e-11ef-90ba-bd9ac35bc167"; // Replace with the actual URL

  try {
    // Forward the request to the external API
    const externalResponse = await fetch(externalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "", // Replace with the API key, if required
      },
      body: JSON.stringify({ TG, Q, SQ, SP, NG, RH, FHVEC, FXX, DDVEC, PG }),
    });

    if (!externalResponse.ok) {
      throw new Error(`External API error! Status: ${externalResponse.status}`);
    }

    // Capture the external API's response
    const externalData = await externalResponse.json();

    // Send the external API's response back to your client
    res.json({
      message: "Response from external API successfully retrieved!",
      externalData,
    });
  } catch (error) {
    console.error("Error interacting with external API:", error);
    res.status(500).json({ error: "Failed to fetch data from external API" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
