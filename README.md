# Urdu Madrasa Management System

**Urdu Madrasa Management System** is a web application built using Node.js, Express.js, MongoDB, and Handlebars (HBS) for managing and maintaining records and operations in a Madrasa. This application is specifically designed to cater to Madrasas that operate in Urdu-speaking regions. It provides a user-friendly interface for administrators and staff to manage students, courses, attendance, and other aspects of Madrasa management efficiently.


## Features

- **User Authentication:** Secure user authentication using JWT tokens or sessions.
- **Dashboard:** A central dashboard for administrators to get an overview of Madrasa activities.
- **Student Management:** Add, edit, and delete student records with their personal details.
- **Course Management:** Manage courses and subjects offered by the Madrasa.
- **Attendance Tracking:** Record and manage daily student attendance.
- **Fee Management:** Keep track of fees paid by students and generate reports.
- **Notice Board:** Post important notices and announcements for students and staff.
- **User Roles:** Assign roles to users (admin, teacher, staff) with varying levels of access.
- **Search and Filters:** Easily search for students, courses, and other data with powerful filtering options.
- **Reports:** Generate reports for attendance, fees, and student details.

## Prerequisites

Before running this application, make sure you have the following software installed:

- Node.js and npm: [Download Node.js](https://nodejs.org/)
- MongoDB: [Download MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/khan-suliman/madrasah.git

   ```

2. Navigate to the project directory

   ```bash
   cd madrasah
   ```

3. Install dependencies

   ```bash
   npm install
   ```
   
4. Create a .env file under src/config/ and set the port

   ```env
   PORT=3001
   ```

5. Run the application

   ```bash
   npm start
   ```
