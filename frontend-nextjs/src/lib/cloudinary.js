import api from "@/lib/axios";

export const uploadToCloudinary = async (file, onProgress) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  if (!cloudName) {
    throw new Error("Cloudinary cloud name is not configured");
  }
  if (!apiKey) {
    throw new Error("Cloudinary API key is not configured");
  }

  const resourceType = file.type === "application/pdf" ? "raw" : "image";
  const { data } = await api.post("/uploads/cloudinary/signature", {
    resource_type: resourceType,
    folder: "dzartisan/profiles",
  });

  const signed = data?.data;
  if (!signed?.signature || !signed?.timestamp) {
    throw new Error("Failed to obtain Cloudinary upload signature");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(signed.timestamp));
  formData.append("signature", signed.signature);
  formData.append("folder", signed.folder || "dzartisan/profiles");

  const endpoint = `${resourceType}/upload`;

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
