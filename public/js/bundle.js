/* eslint-disable */ const $fc9f18cd978afa5b$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $fc9f18cd978afa5b$export$de026b00723010c1 = (type, msg)=>{
    $fc9f18cd978afa5b$export$516836c6a9dfc573();
    const markup = `<div class='alert alert--${type}'>${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout($fc9f18cd978afa5b$export$516836c6a9dfc573, 3000);
};


async function $e33d9ff231aec008$export$da4fc2bf424da4ca(data) {
    try {
        const response = await axios.post(`${"http://127.0.0.1:3000"}/api/v1/users/login`, data);
        if (response.data.status === "success") {
            (0, $fc9f18cd978afa5b$export$de026b00723010c1)("success", "Logged in successfully!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 800);
        }
    } catch (error) {
        (0, $fc9f18cd978afa5b$export$de026b00723010c1)("error", error.response.data.message);
    }
}
async function $e33d9ff231aec008$export$297d1113e3afbc21() {
    try {
        const response = await axios.get(`${"http://127.0.0.1:3000"}/api/v1/users/logout`);
        if (response.data.status === "success") {
            location.reload(true);
            (0, $fc9f18cd978afa5b$export$de026b00723010c1)("success", "Logged out successfully!");
        }
    } catch (error) {
        console.log(error);
        (0, $fc9f18cd978afa5b$export$de026b00723010c1)("error", error.response.data.message);
    }
}


/* eslint-disable */ const $f6b1c9ed51ec7162$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = "pk.eyJ1IjoidGhhaXZoaGUiLCJhIjoiY20xZXQxcGl3MmUwdDJqb2Z1cTgweXNiOCJ9.aWOxeJxmft1aaWfJLxPQog";
    const map = new mapboxgl.Map({
        container: "map",
        // center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        // zoom: 9, // starting zoom
        projection: "mercator"
    });
    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc)=>{
        // Create marker
        const el = document.createElement("div");
        el.className = "marker";
        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        // Add popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};


// DOM ELEMENTS
const $1cd085a7ac742057$var$loginForm = document.querySelector(".form");
const $1cd085a7ac742057$var$mapBox = document.getElementById("map");
const $1cd085a7ac742057$var$logoutBtn = document.querySelector(".nav__el--logout");
// DELEGATION
if ($1cd085a7ac742057$var$mapBox) {
    const locations = JSON.parse($1cd085a7ac742057$var$mapBox.dataset.locations);
    (0, $f6b1c9ed51ec7162$export$4c5dd147b21b9176)(locations);
}
if ($1cd085a7ac742057$var$loginForm) addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $e33d9ff231aec008$export$da4fc2bf424da4ca)({
        email: email,
        password: password
    });
});
if ($1cd085a7ac742057$var$logoutBtn) addEventListener("click", async ()=>{
    (0, $e33d9ff231aec008$export$297d1113e3afbc21)();
});


//# sourceMappingURL=bundle.js.map
