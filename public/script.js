document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("cvFile");

  // --- 1️⃣ Ask for location permission ---
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("Location:", latitude, longitude);

        // Send location to server
        fetch("/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude, longitude }),
        })
          .then((res) => res.text())
          .then((msg) => console.log("Server response:", msg))
          .catch((err) => console.error("Error sending location:", err));
      },
      (error) => {
        console.error("Location access denied or error:", error);
      }
    );
  } else {
    alert("Geolocation not supported by this browser.");
  }

  // --- 2️⃣ Handle CV upload ---
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      alert("Please select a file before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("cv", file);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        console.log("Upload response:", msg);
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
        alert("Upload failed.");
      });
  });
});
