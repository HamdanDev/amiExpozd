// Fetch IP and location data
fetch("/ip-info")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("ip").textContent = data.ip || "Unknown";
    document.getElementById(
      "location"
    ).textContent = `${data.city}, ${data.region}, ${data.country}`;
    document.getElementById("isp").textContent = data.isp || "Unknown";
    document.getElementById("vpn").textContent = data.vpn || "Unknown";
  })
  .catch((error) => console.error("Error fetching IP data:", error));

document.getElementById("search-btn").addEventListener("click", function () {
  let searchQuery = document.getElementById("search-input").value;
  if (searchQuery) {
    // Add the search query to the history and load it
    addSearchToHistory(searchQuery);
    loadSearchHistory();
  }
});
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

//document.getElementById("browser").textContent = navigator.userAgent;
function detectBrowser() {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";

  if (userAgent.includes("Firefox")) {
    browserName = "Firefox";
  } else if (userAgent.includes("Edg")) {
    browserName = "Microsoft Edge";
  } else if (userAgent.includes("Brave") || navigator.brave) {
    browserName = "Brave";
  } else if (userAgent.includes("Chrome")) {
    // Check for Brave (hidden by default)
    navigator.brave ? (browserName = "Brave") : (browserName = "Google Chrome");
  } else if (userAgent.includes("Safari")) {
    browserName = "Safari";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    browserName = "Opera";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    browserName = "Internet Explorer";
  }

  document.getElementById("browser").textContent = browserName;
}

detectBrowser();

document.getElementById("os").textContent = getWindowsVersion();
document.getElementById(
  "screen"
).textContent = `${window.screen.width}x${window.screen.height}`;

// WebRTC Leak Test (Check internal IPs)
const webrtcCheck = async () => {
  let rtcPeerConnection = new RTCPeerConnection({ iceServers: [] });
  rtcPeerConnection.createDataChannel("");
  rtcPeerConnection
    .createOffer()
    .then((offer) => rtcPeerConnection.setLocalDescription(offer));

  rtcPeerConnection.onicecandidate = (event) => {
    if (event && event.candidate && event.candidate.candidate) {
      let candidate = event.candidate.candidate;
      if (!candidate.includes("relay") && !candidate.includes("srflx")) {
        document.getElementById("webrtc-ip").textContent =
          candidate.split(" ")[4]; // Extract local IP
      } else {
        document.getElementById("webrtc-ip").textContent = "No WebRTC Leak";
      }
    }
  };
};
webrtcCheck();

// Detect Fingerprint
Fingerprint2.get((components) => {
  let values = components.map((component) => component.value);
  let fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
  document.getElementById("fingerprint").textContent = fingerprint;
});

// Check Cookies
document.getElementById("cookies").textContent = navigator.cookieEnabled
  ? "Yes"
  : "No";

// Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Ad Blocker Detection
function detectAdBlock() {
  let adBlockDetected = false;

  // Try loading a fake ad script
  let testScript = document.createElement("script");
  testScript.src =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  testScript.type = "text/javascript";
  testScript.onerror = function () {
    adBlockDetected = true;
    document.getElementById("adblock").textContent = "Yes 🚫";
  };

  document.head.appendChild(testScript);

  // Also test using a hidden ad div
  let testAd = document.createElement("div");
  testAd.className = "adsbox";
  document.body.appendChild(testAd);

  setTimeout(() => {
    if (testAd.offsetHeight === 0) {
      adBlockDetected = true;
    }
    testAd.remove();

    document.getElementById("adblock").textContent = adBlockDetected
      ? "Yes 🚫"
      : "No ✅";
  }, 500);
}

detectAdBlock();

// Load Search History Dropdown
// Function to save a search query to localStorage
function addSearchToHistory(query) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  // Add the new search to the beginning of the list
  history.unshift(query);
  // Keep only the last 5 searches
  if (history.length > 5) history.pop();
  // Save the updated history back to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

// Function to load and display the search history
function loadSearchHistory() {
  let searchDropdown = document.getElementById("search-history");
  searchDropdown.innerHTML = `<option>Recent Searches</option>`; // Reset dropdown

  // Get the history from localStorage
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  if (history.length === 0) {
    let option = document.createElement("option");
    option.textContent = "No searches yet";
    searchDropdown.appendChild(option);
  } else {
    history.forEach((search) => {
      let option = document.createElement("option");
      option.textContent = search;
      searchDropdown.appendChild(option);
    });
  }
}

// Call this function on page load to display recent searches
loadSearchHistory();

// Function to detect Google search referrer
function getGoogleSearchReferrer() {
  let referrer = document.referrer;
  let searchQuery = null;

  // Check if the referrer is from Google search
  if (referrer.includes("google.com/search?q=")) {
    let urlParams = new URL(referrer).searchParams;
    searchQuery = urlParams.get("q"); // Extract search query from Google
  }

  if (searchQuery) {
    // Add search query to history
    addSearchToHistory(searchQuery);
  }
}

// Call the function on page load
getGoogleSearchReferrer();
