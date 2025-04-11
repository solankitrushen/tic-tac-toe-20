export default {
    testEnvironment: 'node',            // Use 'node' environment for backend testing
        transform: {
        '^.+\\.js$': 'babel-jest',       // Use babel-jest for transforming JavaScript files
    },
    moduleFileExtensions: ['js', 'json'], // Supported file extensions
        testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore these paths during testing
            collectCoverage: true,              // Enable coverage collection
                coverageDirectory: 'coverage',      // Directory to store coverage reports
                    coverageThreshold: {
        global: {
            branches: 80,                   // Require 80% branch coverage
                functions: 80,                  // Require 80% function coverage
                    lines: 80,                      // Require 80% line coverage
                        statements: 80                  // Require 80% statement coverage
        }
    },
    setupFiles: ['dotenv/config'],      // Load environment variables from .env file
};
