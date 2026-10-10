
const view = document.getElementById("view");
const nav = document.getElementById("nav");

const pages = {
  home: `
    <section class="card">
      <h2>🌱 Welcome to Polytechnica</h2>
      <p>Monitor. Diagnose. Correct. Grow Better.</p>
      <p>Your smart polyhouse management dashboard.</p>
    </section>
    <section class="card">
      <h2>🌡️ Environmental Monitoring</h2>
      <p>Temperature: Waiting for sensor data</p>
      <p>Humidity: Waiting for sensor data</p>
      <p>Soil moisture: Waiting for sensor data</p>
    </section>
    <section class="card">
      <h2>🌿 Crop Health</h2>
      <p>Upload a crop image to begin a preliminary disease assessment.</p>
      <label for="cropImage">Choose crop image</label>
      <input id="cropImage" type="file" accept="image/*">
      <div id="imagePreview"></div>
      <p id="diagnosisNote">Image selection only. AI diagnosis requires a configured backend.</p>
    </section>
  `,
  monitor: `
    <section class="card">
      <h2>Environmental Monitoring</h2>
      <p>Live readings require connected sensors and a configured backend.</p>
    </section>
  `,
  diagnose: `
    <section class="card">
      <h2>Crop Disease Assessment</h2>
      <input id="cropImage" type="file" accept="image/*">
      <div id="imagePreview"></div>
      <p>Choose a crop photo for preview. This page does not diagnose disease by itself.</p>
    </section>
  `
};

function showPage(page = "home") {
  view.innerHTML = pages[page] || pages.home;
  nav.innerHTML = `
    <button data-page="home">🏠 Home</button>
    <button data-page="monitor">🌡️ Monitor</button>
    <button data-page="diagnose">🌿 Crop Health</button>
  `;
}

nav.addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (button) showPage(button.dataset.page);
});

view.addEventListener("change", event => {
  if (event.target.id !== "cropImage") return;
  const file = event.target.files[0];
  const preview = document.getElementById("imagePreview");
  if (!file || !preview) return;

  const image = document.createElement("img");
  image.alt = "Selected crop preview";
  image.style.maxWidth = "100%";
  image.style.borderRadius = "12px";
  image.src = URL.createObjectURL(file);
  preview.replaceChildren(image);
});

showPage();
