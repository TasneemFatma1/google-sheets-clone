# Google Sheets Clone

This project is a web application that mimics the user interface and core functionalities of Google Sheets. It allows users to create, edit, and manage spreadsheets with various mathematical and data quality functions.

## Project Structure

```
google-sheets-clone
├── index.html          # Main entry point of the web application
├── css
│   └── styles.css     # Styles for the application
├── js
│   ├── app.js         # Main JavaScript file for application logic
│   ├── spreadsheet.js  # Logic for managing spreadsheet data
│   ├── mathFunctions.js # Mathematical functions for calculations
│   └── dataValidation.js # Functions for data quality operations
├── tests
│   └── app.test.js    # Unit tests for the application
└── README.md          # Documentation for the project
```

## Features

- **Spreadsheet Interface**: A user-friendly grid layout for data entry and manipulation.
- **Mathematical Functions**: Support for functions like SUM, AVERAGE, MAX, MIN, and COUNT.
- **Data Quality Functions**: Includes TRIM, UPPER, LOWER, REMOVE_DUPLICATES, and FIND_AND_REPLACE.
- **Data Entry and Validation**: Ensures that data entered meets specified criteria.
- **Testing Capabilities**: Unit tests to verify the functionality of features.

## Tech Stack

- **HTML**: For structuring the web application.
- **CSS**: For styling and layout.
- **JavaScript**: For implementing the core functionalities and interactivity.

## Design Decisions

The application is designed to closely resemble Google Sheets in both functionality and user experience. The choice of technologies allows for a responsive and interactive interface, making it easy for users to manage their data effectively.

## Getting Started

To run the application, open `index.html` in a web browser. You can start entering data into the spreadsheet and utilize the available functions for calculations and data validation.