import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import routes from "./routes";
import i18nMiddleware from "./middleware/i18n";
import { setupSwagger } from "./config/swagger";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3030;
const isProduction = process.env.NODE_ENV === "production";
app.use(compression());
app.use(cors());
app.use(express.json()); // This ensures JSON request bodies are parsed
app.use(express.urlencoded({ extended: true })); // Optional: Handles URL-encoded data

// Define allowed origins with safe fallbacks
// const allowedOrigins: string[] = [
//   process.env.staging_url || "http://localhost:3030",
//   `https://${process.env.production_url}`,
// ];

// Proper CORS Configuration with TypeScript Fix
// const corsOptions: CorsOptions = {
//   origin: (
//     origin: string | undefined,
//     callback: (error: Error | null, allow: boolean | undefined) => void
//   ) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"), false); // ✅ Fix: Provide second argument `false`
//     }
//   },
//   credentials: true, // Allow cookies & authentication headers
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed HTTP methods
//   allowedHeaders: [
//     "Origin",
//     "X-Requested-With",
//     "Content-Type",
//     "Accept",
//     "Authorization",
//     "Accept-Language"
//   ],
//   exposedHeaders: ["Authorization"], // Allow frontend to read these headers
// };

// Apply CORS Middleware
// app.use(cors(corsOptions));

// Security headers
// app.use(
//   helmet({
//     crossOriginOpenerPolicy: isProduction ? { policy: "same-origin" } : false,
//     contentSecurityPolicy: isProduction ? {
//           directives: {
//             ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//             "script-src": ["'self'", "'unsafe-inline'"],
//           },
//         }
//       : false,
//   })
// );

// Logging
if (!isProduction) {
  app.use(morgan("dev"));
}

// Explicitly Allow Swagger UI
app.use("/api-docs", cors({ origin: "*" }));

// Use the middleware for localization
app.use(i18nMiddleware);

// Routes
app.use("/api", routes);

// Setup Swagger documentation
setupSwagger(app);

export default app;
