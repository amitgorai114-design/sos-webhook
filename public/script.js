document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("cvFile");

  // Request location access
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("Location:", latitude, longitude);

        fetch("/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude, longitude }),
        })
          .then((res) => res.text())
          .then(console.log)
          .catch(console.error);
      },
      (err) => console.error("Location error:", err)
    );
  } else {
    alert("Geolocation not supported.");
  }

  // Upload form
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("cv", file);

    fetch("/upload", { method: "POST", body: formData })
      .then((res) => res.text())
      .then((msg) => alert(msg))
      .catch((err) => alert("Upload failed: " + err.message));
  });
});
