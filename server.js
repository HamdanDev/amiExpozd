require('dotenv').config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const apiKey = process.env.IPHUB_TOKEN; // Access the variable
console.log('IPHUB_TOKEN : ',apiKey);

const apiKey2 = process.env.IPINFO_TOKEN; // Access the variable
console.log('IPINFO_TOKEN : ',apiKey2);

const apiKey3 = process.env.FINGERPRINTJS_TOKEN; // Access the variable
console.log('FINGERPRINTJS_TOKEN : ',apiKey3);

app.get("/ip-info", async (req, res) => {
    try {
        // Fetch public IP
        const ipResponse = await axios.get("https://api64.ipify.org?format=json");
        const userIp = ipResponse.data.ip;

        // Get location, ISP, and VPN details from ipinfo.io
        //const infoResponse = await axios.get(`https://ipinfo.io/${userIp}/json?token=YOUR_IPINFO_TOKEN`);
        const infoResponse = await axios.get(`https://ipinfo.io/${userIp}/json?token=${process.env.IPINFO_TOKEN}`);
        
        
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

app.get("/vpn-detect", async (req, res) => {
    try {
        const ipResponse = await axios.get("https://api64.ipify.org?format=json");
        const userIp = ipResponse.data.ip;
        const vpnResponse = await axios.get(`http://v2.api.iphub.info/ip/${userIp}`, {
            headers: { "X-Key": process.env.IPHUB_TOKEN }
        });

        res.json({ vpnDetected: vpnResponse.data.block === 1 ? "Yes" : "No" });
    } catch (error) {
        console.error("Error fetching VPN data:", error);
        res.status(500).json({ error: "Failed to check VPN status" });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
