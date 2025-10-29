document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("status");
  status.textContent = "Requesting location...";

  if (!navigator.geolocation) {
    return (status.textContent = "Geolocation is not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;

    status.textContent = "Uploading CV and location...";

    const formData = new FormData();
    const fileInput = document.getElementById("cvInput");
    formData.append("cv", fileInput.files[0]);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    status.textContent = text;
  }, 
  () => {
    status.textContent = "Location permission denied.";
  });
});
