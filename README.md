# 🦷 Dental Clinic Billing System

A comprehensive desktop application for managing dental clinic operations including patient records, appointments, treatments, and billing.

## 🚀 Features

- **Patient Management** - Register and manage patient records with complete history
- **Appointment Scheduling** - Book and manage appointments with doctors
- **Treatment Tracking** - Record treatments with flexible pricing
- **Billing & Payments** - Handle full and partial payments with multiple payment modes
- **Role-Based Access** - Admin, Doctor, and Front Office roles
- **Offline First** - Works completely offline, no internet required
- **Print Bills** - Generate and print professional bills/receipts

## 🛠️ Technology Stack

- **Frontend**: React.js with Vite
- **Backend**: Electron (Node.js)
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS
- **Authentication**: bcrypt + JWT

## 📋 Project Structure

```
dental-clinic-billing/
├── electron/              # Electron main process
│   ├── main.js           # App entry point
│   ├── preload.js        # IPC bridge
│   └── database/
│       └── db.js         # SQLite configuration
├── src/                  # React frontend
│   ├── components/       # Reusable components
│   ├── pages/           # Application pages
│   ├── App.jsx          # Main app component
│   └── main.jsx         # React entry
├── public/              # Static assets
└── package.json         # Dependencies
```

## 🗄️ Database Schema

The application uses SQLite with the following tables:

1. **users** - User authentication and roles
2. **doctors** - Doctor information
3. **patients** - Patient records
4. **treatments_master** - Treatment catalog with pricing
5. **appointments** - Appointment scheduling
6. **visits** - Patient visit records
7. **visit_treatments** - Treatments performed during visits
8. **payments** - Payment transactions
9. **bills** - Invoice records
10. **clinic_settings** - Clinic configuration

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dineshgowri/billing-system.git
cd billing-system
```

2. Install dependencies:
```bash
npm install
```

3. Run the application in development mode:
```bash
npm run dev
```

### Building for Production

To build the application for your platform:

```bash
npm run electron:build
```

This will create installers in the `build/` directory.

## 🔐 Default Credentials

- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change the default password after first login!

## 📦 Pre-loaded Data

The application comes with:
- 1 Admin user (username: admin)
- 10 Common dental treatments (Consultation, Cleaning, Filling, Root Canal, etc.)

## 👥 User Roles

### Admin
- Full access to all features
- User management
- System configuration
- Reports and analytics

### Doctor
- View patient records
- View treatment history
- View billing information
- Add treatment notes

### Front Office
- Patient registration
- Appointment booking
- Billing and payments
- Print receipts

## 📝 Development Sessions

This project is being built incrementally across multiple sessions:

### ✅ Session 1 (Completed)
- Project structure and configuration
- Electron + React + Vite setup
- SQLite database with 10 tables
- Basic UI with connection tests

### 📋 Upcoming Sessions
- Session 2: Login & Authentication
- Session 3: Dashboard & Navigation
- Session 4-7: Patient Management
- Session 8-9: Treatment Master
- Session 10-12: Appointments
- Session 13-17: Visit & Billing
- Session 18-20: Bill Printing
- Session 21-24: Reports
- Session 25-27: User & Settings Management
- Session 28-30: Final Polish & Testing

## 🔧 Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build React app for production
- `npm run electron` - Run Electron app
- `npm run electron:build` - Build and package desktop app

## 📄 License

ISC License

## 👨‍💻 Author

Dinesh Gowri

---

**Built with ❤️ for dental clinics**
