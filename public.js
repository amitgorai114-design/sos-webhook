document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const fileInput = document.getElementById("cv");
  const formData = new FormData();
  formData.append("cv", fileInput.files[0]);

  const message = document.getElementById("message");
  message.textContent = "Uploading...";

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    message.textContent = text;
  } catch (error) {
    message.textContent = "Upload failed. Try again.";
    console.error(error);
  }
});
