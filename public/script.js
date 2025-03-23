// Fetch external IP first
//fetch("https://api64.ipify.org?format=json")


// Fetch IP and location data
fetch("/ip-info")
    .then(response => response.json())
    .then(data => {
        document.getElementById("ip").textContent = data.ip || "Unknown";
        document.getElementById("location").textContent = `${data.city}, ${data.region}, ${data.country}`;
        document.getElementById("isp").textContent = data.isp || "Unknown";
        document.getElementById("vpn").textContent = data.vpn || "Unknown";
    })
    .catch(error => console.error("Error fetching IP data:", error));

// Detect browser, OS, and screen size
function getWindowsVersion() {
    let userAgent = navigator.userAgent;
    if (userAgent.includes("Windows NT 10.0")) return "Windows 10/11";
    if (userAgent.includes("Windows NT 6.3")) return "Windows 8.1";
    if (userAgent.includes("Windows NT 6.2")) return "Windows 8";
    if (userAgent.includes("Windows NT 6.1")) return "Windows 7";
    if (userAgent.includes("Windows NT 6.0")) return "Windows Vista";
    if (userAgent.includes("Windows NT 5.1")) return "Windows XP";
    return "Unknown Windows Version";
}

document.getElementById("browser").textContent = navigator.userAgent;
document.getElementById("os").textContent = getWindowsVersion();
document.getElementById("screen").textContent = `${window.screen.width}x${window.screen.height}`;

// WebRTC Leak Test (Check internal IPs)
const webrtcCheck = async () => {
    let rtcPeerConnection = new RTCPeerConnection({ iceServers: [] });
    rtcPeerConnection.createDataChannel("");
    rtcPeerConnection.createOffer().then(offer => rtcPeerConnection.setLocalDescription(offer));

    rtcPeerConnection.onicecandidate = event => {
        if (event && event.candidate && event.candidate.candidate) {
            let candidate = event.candidate.candidate;
            if (!candidate.includes("relay") && !candidate.includes("srflx")) {
                document.getElementById("webrtc-ip").textContent = candidate.split(" ")[4]; // Extract local IP
            } else {
                document.getElementById("webrtc-ip").textContent = "No WebRTC Leak";
            }
        }
    };
};
webrtcCheck();

// Detect Fingerprint
Fingerprint2.get(components => {
    let values = components.map(component => component.value);
    let fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
    document.getElementById("fingerprint").textContent = fingerprint;
});

// Check Cookies
document.getElementById("cookies").textContent = navigator.cookieEnabled ? "Yes" : "No";

// Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Ad Blocker Detection
function detectAdBlock() {
    let testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbox";
    document.body.appendChild(testAd);
    window.setTimeout(() => {
        if (testAd.offsetHeight === 0) {
            document.getElementById("adblock").textContent = "Yes (Ad Blocker Detected)";
        } else {
            document.getElementById("adblock").textContent = "No";
        }
        testAd.remove();
    }, 100);
}
detectAdBlock();

// Load Search History Dropdown
async function loadSearchHistory() {
    try {
        let historyItems = await navigator.storage.estimate(); // Simulated search history
        let dropdown = document.getElementById("search-history");
        dropdown.innerHTML = "<option>Recent Searches</option>";
        dropdown.innerHTML += `<option>Example Search 1</option>`;
        dropdown.innerHTML += `<option>Example Search 2</option>`;
    } catch (error) {
        console.error("Error loading search history:", error);
    }
}
loadSearchHistory();
