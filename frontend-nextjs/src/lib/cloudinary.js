/**
 * Simple Cloudinary upload utility
 * Note: In a production app, the signature should be generated on the backend.
 * For this MVP, we use an unsigned upload preset.
 */

export const uploadToCloudinary = async (file, onProgress) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "dzartisan_presets";
  if (!cloudName) {
    throw new Error("Cloudinary cloud name is not configured");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", "dzartisan/profiles");

  const endpoint = file.type === "application/pdf" ? "raw/upload" : "image/upload";

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        let message = "Cloudinary upload failed";
        try {
          const parsed = JSON.parse(xhr.responseText);
          message = parsed?.error?.message || message;
        } catch {}
        reject(new Error(message));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
};
