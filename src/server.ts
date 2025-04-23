import connectDB from "./config/database";
import app from "./app"; // Your Express app

const PORT = process.env.PORT ? Number(process.env.PORT) : 3030;

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {  // <-- Add this
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });