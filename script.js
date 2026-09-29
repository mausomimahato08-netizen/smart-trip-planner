// ==========================
// Budget Calculator
// ==========================

function calculate() {

    const days = Number(document.getElementById("days")?.value || 0);
    const budget = Number(document.getElementById("budget")?.value || 0);

    const result = document.getElementById("result");

    if (!result) return;

    if (days === 0 || budget === 0) {
        result.innerHTML = "Please enter all details.";
        return;
    }

    result.innerHTML =
        "Estimated Budget: ₹" + (days * budget).toLocaleString("en-IN");
}

// ==========================
// Search Destination
// ==========================

const searchBtn = document.querySelector(".search-box button");

if (searchBtn) {

    searchBtn.addEventListener("click", () => {

        const place = document.querySelector(".search-box input").value.trim();

        if (place === "") {
            alert("Please enter a destination.");
            return;
        }

        alert("Searching trips for " + place + "...");

    });

}

// ==========================
// Dark Mode
// ==========================

const darkBtn = document.createElement("button");

darkBtn.innerHTML = "🌙";
darkBtn.className = "dark-mode-btn";

document.body.appendChild(darkBtn);

darkBtn.style.position = "fixed";
darkBtn.style.bottom = "20px";
darkBtn.style.right = "20px";
darkBtn.style.width = "55px";
darkBtn.style.height = "55px";
darkBtn.style.border = "none";
darkBtn.style.borderRadius = "50%";
darkBtn.style.cursor = "pointer";

darkBtn.onclick = function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        document.body.style.background = "#121212";
        document.body.style.color = "#fff";
        darkBtn.innerHTML = "☀️";

    } else {

        document.body.style.background = "#f5f7fa";
        document.body.style.color = "#333";
        darkBtn.innerHTML = "🌙";

    }

};
// ==========================
// SAVE TRIP
// ==========================

const tripForm = document.getElementById("tripForm");

if (tripForm) {

    tripForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const destination = document.getElementById("destination").value;
        const travelDate = document.getElementById("travelDate").value;
        const travelers = document.getElementById("travelers").value;
        const budget = document.getElementById("budget").value;

        try {

            const response = await fetch("http://localhost:5000/api/save-trip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    destination,
                    travelDate,
                    travelers,
                    budget
                })
            });

            const data = await response.json();

            showToast(data.message);

            if (data.success) {
                tripForm.reset();
                loadTrips();
                generateAIPlan(destination);
            }

        } catch (error) {
            showToast("Server Error");
            console.log(error);
        }

    });

}

// ==========================
// LOAD ALL TRIPS
// ==========================

async function loadTrips() {

    const tripList = document.getElementById("tripList");

    if (!tripList) return;

    try {

        const response = await fetch("http://localhost:5000/api/trips");
        const data = await response.json();

        tripList.innerHTML = "";

        let totalBudget = 0;
        let TotalTravelers = 0;
        data.trips.forEach((trip) => {

            totalBudget += Number(trip.budget);
            TotalTravelers += Number(trip.travelers);
            tripList.innerHTML += `
            <div class="card">
                <h3>${trip.destination}</h3>
                <p>📅 ${trip.travelDate}</p>
                <p>👥 ${trip.travelers} Travelers</p>
                <p>💰 ₹${trip.budget}</p>

                <button onclick="editTrip('${trip._id}','${trip.destination}','${trip.travelDate}','${trip.travelers}','${trip.budget}')">
                    Edit
                </button>

                <button onclick="deleteTrip('${trip._id}')">
                    Delete
                </button>

                <button onclick="favoriteTrip('${trip._id}')">
                    ⭐ Favorite
                </button>
            </div>
            `;

        });
        
        document.getElementById("totalTrips").innerText = data.trips.length;
        document.getElementById("totalBudget").innerText = "₹" + totalBudget;
        document.getElementById("avgBudget").innerText = "₹" + Math.round(totalBudget / (data.trips.length || 1));

    } catch (error) {
        console.log(error);
    }

}

loadTrips();
// ==========================
// TOAST NOTIFICATION
// ==========================

function showToast(message) {

    const toast = document.createElement("div");

    toast.innerHTML = message;

    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.background = "#28a745";
    toast.style.color = "#fff";
    toast.style.padding = "15px 25px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);

}

// ==========================
// FAVORITE DESTINATIONS
// ==========================

document.querySelectorAll(".card").forEach(card => {

    const fav = document.createElement("span");

    fav.innerHTML = "🤍";
    fav.style.float = "right";
    fav.style.cursor = "pointer";

    card.prepend(fav);

    fav.onclick = () => {

        if (fav.innerHTML === "🤍") {

            fav.innerHTML = "❤️";
            showToast("Added to Favorites");

        } else {

            fav.innerHTML = "🤍";
            showToast("Removed from Favorites");

        }

    };

});

// ==========================
// WELCOME MESSAGE
// ==========================

window.onload = () => {

    showToast("Welcome to TripSmart India 🇮🇳");

};
async function deleteTrip(id) {

    if (!confirm("Are you sure you want to delete this trip?")) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/delete-trip/" + id,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        alert(data.message);

        loadTrips();

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }
}
async function editTrip(id, destination, travelDate, travelers, budget) {

    const newDestination = prompt("Destination", destination);
    const newDate = prompt("Travel Date", travelDate);
    const newTravelers = prompt("Travelers", travelers);
    const newBudget = prompt("Budget", budget);

    if (!newDestination) return;

    const response = await fetch(
        "http://localhost:5000/api/update-trip/" + id,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                destination: newDestination,
                travelDate: newDate,
                travelers: newTravelers,
                budget: newBudget
            })
        }
    );

    const data = await response.json();

    alert(data.message);

    loadTrips();
}
async function favoriteTrip(id) {

    const response = await fetch(
        "http://localhost:5000/api/favorite-trip/" + id,
        {
            method: "PUT"
        }
    );

    const data = await response.json();

    alert(data.message);

    loadTrips();
}
async function getWeather(city) { 
           
    try {

        const response = await fetch(
            "https://wttr.in/" + city + "?format=j1"
        );

        const data = await response.json();

        document.getElementById("city").innerText = city;
        document.getElementById("temp").innerText =
            data.current_condition[0].temp_C + "°C";
        document.getElementById("condition").innerText =
            data.current_condition[0].weatherDesc[0].value;

    } catch (error) {
        console.log(error);
    }

}
function checkWeather() {

    const city = document.getElementById("weatherCity").value.trim();

    if (city === "") {
        alert("Please enter a city.");
        return;
    }

    getWeather(city);
}
function generateAIPlan(destination) {

    let plan = "";

    switch (destination.toLowerCase()) {

        case "goa":
            plan = "🏖️ Visit Baga Beach, Calangute Beach, Fort Aguada and enjoy water sports.";
            break;

        case "agra":
            plan = "🕌 Visit Taj Mahal, Agra Fort, Mehtab Bagh and local markets.";
            break;

        case "jaipur":
            plan = "🏰 Explore Hawa Mahal, Amer Fort, City Palace and local shopping.";
            break;

        case "kerala":
            plan = "🌴 Enjoy Alleppey Backwaters, Munnar Tea Gardens and Kovalam Beach.";
            break;

        case "ladakh":
            plan = "🏔️ Visit Pangong Lake, Nubra Valley and Magnetic Hill.";
            break;

        default:
            plan = "✨ Explore famous places, try local food and enjoy your trip!";
    }

    document.getElementById("aiPlan").innerText = plan;
}
function searchTrips() {

    const search =
        document.getElementById("tripSearch").value.toLowerCase();

    const cards =
        document.querySelectorAll("#tripList .card");

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if (text.includes(search)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
}
function showFavorites() {

    const cards = document.querySelectorAll("#tripList .card");

    cards.forEach(card => {

        if (!card.innerText.includes("⭐ Favorite")) {
            card.style.display = "none";
        } else {
            card.style.display = "block";
        }

    });
}

function showAllTrips() {

    const cards = document.querySelectorAll("#tripList .card");

    cards.forEach(card => {
        card.style.display = "block";
    });

}
function openMap() {

    const place =
        document.getElementById("mapDestination").value.trim();

    if (place === "") {
        alert("Please enter a destination.");
        return;
    }

    const mapURL =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(place);

    window.open(mapURL, "_blank");
}
function searchHotels() {

    const city =
        document.getElementById("hotelDestination").value.trim();

    if (city === "") {
        alert("Please enter a city.");
        return;
    }

    const hotelURL =
        "https://www.google.com/maps/search/hotels+" +
        encodeURIComponent(city);

    window.open(hotelURL, "_blank");
}
function downloadTripPlan() {
    window.print();
}