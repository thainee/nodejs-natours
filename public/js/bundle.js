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


/* eslint-disable */ 
async function $fcd8fe517d2235bd$export$fd44816d6aa79c1b(data, type) {
    try {
        let url = `${"http://127.0.0.1:3000"}/api/v1/users`;
        url += type === "password" ? "/update-password" : "/update-me";
        const res = await axios.patch(url, data);
        if (res.data.status === "success") (0, $fc9f18cd978afa5b$export$de026b00723010c1)("success", `${type} updated successfully!`);
    } catch (err) {
        (0, $fc9f18cd978afa5b$export$de026b00723010c1)("error", err.response.data.message);
    }
}


/* eslint-disable */ 
var $245ad133cda49593$var$stripe = Stripe(undefined);
const $245ad133cda49593$export$8d5bdbf26681c0c2 = async (tourId)=>{
    try {
        // 1) Get checkout session from API
        const session = await axios.get(`${"http://127.0.0.1:3000"}/api/v1/bookings/checkout-session/${tourId}`);
        // 2) Create checkout form + charge credit card
        await $245ad133cda49593$var$stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        (0, $fc9f18cd978afa5b$export$de026b00723010c1)("error", err);
    }
};


// DOM ELEMENTS
const $1cd085a7ac742057$var$loginForm = document.querySelector(".form--login");
const $1cd085a7ac742057$var$mapBox = document.getElementById("map");
const $1cd085a7ac742057$var$logoutBtn = document.querySelector(".nav__el--logout");
const $1cd085a7ac742057$var$userSettingsForm = document.querySelector(".form-user-data");
const $1cd085a7ac742057$var$userPasswordForm = document.querySelector(".form-user-settings");
const $1cd085a7ac742057$var$bookBtn = document.getElementById("book-tour");
// DELEGATION
if ($1cd085a7ac742057$var$mapBox) {
    const locations = JSON.parse($1cd085a7ac742057$var$mapBox.dataset.locations);
    (0, $f6b1c9ed51ec7162$export$4c5dd147b21b9176)(locations);
}
if ($1cd085a7ac742057$var$loginForm) $1cd085a7ac742057$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $e33d9ff231aec008$export$da4fc2bf424da4ca)({
        email: email,
        password: password
    });
});
if ($1cd085a7ac742057$var$userSettingsForm) $1cd085a7ac742057$var$userSettingsForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    document.querySelector(".btn--save-settings").textContent = "Updating...";
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("password", document.getElementById("password").value);
    form.append("photo", document.getElementById("photo").files[0]);
    await (0, $fcd8fe517d2235bd$export$fd44816d6aa79c1b)(form, "data");
    document.querySelector(".btn--save-settings").textContent = "Save settings";
});
if ($1cd085a7ac742057$var$userPasswordForm) $1cd085a7ac742057$var$userPasswordForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    let currentPassword = document.getElementById("password-current").value;
    let password = document.getElementById("password").value;
    let passwordConfirm = document.getElementById("password-confirm").value;
    await (0, $fcd8fe517d2235bd$export$fd44816d6aa79c1b)({
        currentPassword: currentPassword,
        password: password,
        passwordConfirm: passwordConfirm
    }, "password");
    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
});
if ($1cd085a7ac742057$var$logoutBtn) $1cd085a7ac742057$var$logoutBtn.addEventListener("click", (0, $e33d9ff231aec008$export$297d1113e3afbc21));
if ($1cd085a7ac742057$var$bookBtn) $1cd085a7ac742057$var$bookBtn.addEventListener("click", (e)=>{
    e.target.textContent = "Processing...";
    const { tourId: tourId } = e.target.dataset;
    (0, $245ad133cda49593$export$8d5bdbf26681c0c2)(tourId);
    e.target.textContent = "Book tour now!";
});


//# sourceMappingURL=bundle.js.map
