import axios from "axios";

export const notifyJavaService = async (message) => {
  try {
    const res = await axios.post(process.env.JAVA_SERVICE_URL, { message });
    console.log("Java Service Response:", res.data);
  } catch (error) {
    console.error("Error sending to Java Service:", error.message);
  }
};
