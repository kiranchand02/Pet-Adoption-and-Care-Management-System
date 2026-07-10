# 🐾 Pet Adoption and Care Management System

A full-stack web application designed to provide a centralized platform for managing pet adoption, veterinary care, donations, and shelter operations. The system simplifies the adoption process by connecting adopters and administrators, through a secure and user-friendly interface.

Developed as an academic project, this application demonstrates the practical implementation of modern web development technologies, database management, and role-based authentication.

---

## 📖 Project Objectives

- Digitize the pet adoption process.
- Maintain comprehensive pet and medical records.
- Simplify shelter and veterinary management.
- Provide secure role-based access for different users.
- Improve adoption tracking.
- Reduce manual paperwork through automation.
- Deliver a responsive and user-friendly experience.

---

# ✨ Key Features

### User Module
- User Registration & Login
- Secure Authentication
- Browse Available Pets
- Advanced Search & Filtering
- Submit Adoption Requests
- Donation Management
- User Profile Management

### Administrator Module
- Dashboard Overview
- Manage Pets
- Manage Users
- Manage Adoption Requests
- Veterinary Dashboard
- Donation Monitoring
- Report Generation

###  Pet Management
- Pet Registration
- Adoption Status Tracking
- Breed & Category Management
- Pet Health Information

###  Email Services
- Password Reset via Email
- Email Notifications
- Secure Email Integration

---

# 🛠️ Technology Stack

## Frontend
- React 18
- TypeScript
- Material UI (MUI)
- React Router DOM
- Axios
- Recharts
- Day.js
- HTML5
- CSS3
- JavaScript

## Backend
- Node.js
- Express.js
- Nodemailer
- CORS

## Database
- MySQL

---

# ⚙️ System Architecture

```text
               User
                 │
                 ▼
     React + TypeScript Frontend
                 │
                 ▼
        Express Email Server
                 │
                 ▼
           MySQL Database
```
---

# 📂 Project Structure

```text
PetAdoption&Care
│
├── database/
│   └── pet_adoption_database.sql
│
├── docs/
│   ├── EMAIL_SETUP.md
│   ├── PASSWORD_RESET_GUIDE.md
│   ├── SECURITY_FEATURES.md
│   └── SETUP_COMMANDS.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── README.md
├
├──screenshots/
├
├── email-server.js
├── package.json
├── package-lock.json
├── .gitignore
├──LICENSE
└── README.md
```
---

# ▶️ Getting Started

## Prerequisites

Before running the project, ensure the following software is installed:

- Node.js (v16 or above)
- npm
- MySQL


## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/kiranchand02/Pet-Adoption-and-Care-Management-System.git
```

### Navigate to the Project Directory

```bash
cd Pet-Adoption-and-Care-Management-System
```

### Install Backend Dependencies

```bash
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Configure the Database

Import the SQL file into your MySQL server:

```text
database/pet_adoption_database.sql
```

### Start the Backend Server

```bash
npm start
```

### Start the Frontend

```bash
cd frontend
npm start
```

The application will be available at:

```text
http://localhost:3000
```
---

# 📝 Documentation

Additional documentation is available in the **docs/** directory.

-  Email Setup Guide
-  Password Reset Guide
-  Security Features
-  Setup Commands

Detailed frontend documentation is available in:

```text
frontend/README.md
```
---

# 📸 Application Screenshots

### Home Page
![Home](screenshots/Home.png)

### Login Page
![Login](screenshots/Login.png)

### Dashboard
![Dashboard](screenshots/Dashboard.png)

---

# 🎓Learning Outcomes

This project demonstrates practical knowledge of:

- Full Stack Web Development
- React & TypeScript
- RESTful API Integration
- MySQL Database Design
- Authentication & Authorization
- Role-Based Access Control
- Email Integration
- Responsive UI Design
- Software Engineering Principles

---

# 💡 Future Enhancements

- AI-Based Pet Recommendation System
- Online Payment Gateway Integration
- Mobile Application Development
- Cloud Database Deployment
- Real-Time Notifications
- Advanced Analytics & Reporting

---

# 👨‍💻 Author

**Kiran Chand**

Bachelor of Computer Applications (BCA)

Passionate about Full Stack Development, Artificial Intelligence, and UI/UX Design.

---

# 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

> **Note:** This project was developed for academic/educational purposes as part of my coursework.