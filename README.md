C:\aayan website\social-community\
├── app.js
├── config\
│   ├── db.js                  # MongoDB connection
│   ├── loadConfig.js          # Environment-based config loader
│   └── passportConfig.js      # Passport strategies (Google/Apple)
├── controllers\
│   ├── socialController.js      # Social (Google/Apple) login controller
│   └── userController.js      # User profile and other logic
├── services\
│   ├── googleAuthService.js   # Logic for Google login
│   ├── appleAuthService.js    # Logic for Apple login
├── middleware\
│   └── authMiddleware.js      # Auth validation middleware
├── models\
│   └── userModel.js           # User schema (Mongoose)
├── routes\
│   ├── socialRoutes.js          # Social login routes
│   └── userRoutes.js          # User-related routes (e.g., profile)
├── validators\
│   └── userValidator.js       # Joi validation for user data
├── .env                       # Local environment variables
├── .gitignore                 # Ignored files
├── package.json
└── README.md