module.exports = {
  async up(db) {
    // Create collection with schema validation
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["username", "email", "password", "role"],
          properties: {
            _id: { bsonType: "objectId" },
            username: { 
              bsonType: "string",
              description: "Unique user identifier" 
            },
            email: {
              bsonType: "string",
              pattern: "^\\S+@\\S+\\.\\S+$",
              description: "Unique email address"
            },
            password: { 
              bsonType: "string",
              description: "Hashed password string" 
            },
            role: {
              bsonType: "string",
              enum: ["client", "author", "publisher", "admin"],
              description: "User role classification"
            },
            phone_number: { 
              bsonType: ["string", "null"], // Allow null values
              description: "Client contact number (optional)" 
            },
            address: { 
              bsonType: ["string", "null"], // Allow null
              description: "Client address (optional)" 
            },
            wishlist: {
              bsonType: "array",
              items: { bsonType: "objectId" },
              description: "Client's wishlisted items"
            },
            bio: { 
              bsonType: ["string", "null"], 
              description: "Author biography (optional)" 
            },
            image: { 
              bsonType: ["string", "null"], 
              description: "Profile image URL (optional)" 
            },
            birth_date: { 
              bsonType: ["date", "null"], 
              description: "Author birth date (optional)" 
            },
            files: {
              bsonType: "array",
              items: { bsonType: "string" },
              description: "Publisher files (optional)"
            },
            status: {
              bsonType: "string",
              enum: ["pending", "active", "inactive"],
              description: "Publisher account status (Only required for publishers)"
            },
            created_at: { 
              bsonType: "date",
              description: "Account creation timestamp" 
            },
            otp: {
              bsonType: ["object", "null"], // Allow OTP to be null
              description: "OTP verification details",
              properties: {
                code: { bsonType: ["string", "null"] }, // Allow code to be null
                expires_at: { bsonType: ["date", "null"] }, // Allow expiration to be null
                attempts_today: { bsonType: "int", minimum: 0 },
                last_attempt_date: { bsonType: ["date", "null"] },
              },
            },
          }
        },
      },
    });

    // Unique index on email
    await db.collection("users").createIndex(
      { email: 1 }, 
      { 
        unique: true,
        name: "unique_email_index"
      }
    );

    // Unique index on phone_number (only if provided)
    await db.collection("users").createIndex(
      { phone_number: 1 }, 
      { 
        unique: true,
        sparse: true, // Allows null values while ensuring uniqueness
        name: "unique_phone_index"
      }
    );

    // Compound unique index on email & phone_number
    await db.collection("users").createIndex(
      { email: 1, phone_number: 1 }, 
      { 
        unique: true,
        sparse: true, // Allows either field to be null while ensuring unique pairs
        name: "unique_email_phone_index"
      }
    );

    // Publisher status partial index
    await db.collection("users").createIndex(
      { status: 1 },
      { 
        name: "publisher_status_index",
        partialFilterExpression: { role: "publisher" } 
      }
    );
  },

  async down(db) {
    await db.collection("users").drop();
  },
};
