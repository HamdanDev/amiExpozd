const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/ip-info", async (req, res) => {
    try {
        // Fetch public IP
        const ipResponse = await axios.get("https://api64.ipify.org?format=json");
        const userIp = ipResponse.data.ip;

        // Get location, ISP, and VPN details from ipinfo.io
        const infoResponse = await axios.get(`https://ipinfo.io/${userIp}/json?token=YOUR_IPINFO_TOKEN`);
        
        const { city, region, country, org, ip, hostname, bogon, privacy } = infoResponse.data;

        res.json({
            ip: ip || "Unknown",
            city: city || "Unknown",
            region: region || "Unknown",
            country: country || "Unknown",
            isp: org || "Unknown",
            vpn: privacy?.vpn ? "Yes" : "No",
            hostname: hostname || "Unknown",
            bogon: bogon ? "Yes (Private Network)" : "No"
        });
    } catch (error) {
        console.error("Error fetching IP data:", error);
        res.status(500).json({ error: "Failed to retrieve IP information" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
