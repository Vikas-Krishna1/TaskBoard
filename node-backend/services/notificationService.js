import axios from "axios";

export const sendNotification = async (payload) => {
  try {
    const url = process.env.JAVA_SERVICE_URL; // Example: http://localhost:8081/notify
    await axios.post(url, payload);
    console.log("✅ Notification sent:", payload.message);
  } catch (err) {
    console.warn("⚠️ Notification send failed:", err.message);
  }
};
