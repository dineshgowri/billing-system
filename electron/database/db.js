const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

let db = null;

// Get database path
function getDatabasePath() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'dental-clinic.db');
  
  // Ensure directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  return dbPath;
}

// Initialize database connection
function initializeDatabase() {
  try {
    const dbPath = getDatabasePath();
    console.log('Database path:', dbPath);
    
    db = new Database(dbPath, { verbose: console.log });
    db.pragma('journal_mode = WAL'); // Better performance
    
    createTables();
    seedInitialData();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Create all tables
function createTables() {
  // Users table (for login and role management)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'doctor', 'frontoffice')),
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Doctors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialization TEXT,
      phone TEXT,
      email TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Patients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      date_of_birth DATE,
      age INTEGER,
      gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
      notes TEXT,
      registered_date DATE DEFAULT (date('now')),
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Treatments master table
  db.exec(`
    CREATE TABLE IF NOT EXISTS treatments_master (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      default_price REAL NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Appointments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TEXT NOT NULL,
      status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled')),
      notes TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Visits table
  db.exec(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      visit_date DATE DEFAULT (date('now')),
      visit_type TEXT CHECK(visit_type IN ('appointment', 'walk-in')),
      appointment_id INTEGER,
      notes TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id),
      FOREIGN KEY (appointment_id) REFERENCES appointments(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Visit treatments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS visit_treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visit_id INTEGER NOT NULL,
      treatment_id INTEGER NOT NULL,
      treatment_name TEXT NOT NULL,
      price REAL NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (visit_id) REFERENCES visits(id),
      FOREIGN KEY (treatment_id) REFERENCES treatments_master(id)
    )
  `);

  // Payments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visit_id INTEGER,
      patient_id INTEGER NOT NULL,
      payment_date DATE DEFAULT (date('now')),
      amount REAL NOT NULL,
      payment_mode TEXT CHECK(payment_mode IN ('cash', 'card', 'upi')),
      notes TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (visit_id) REFERENCES visits(id),
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Bills table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_number TEXT UNIQUE NOT NULL,
      visit_id INTEGER,
      patient_id INTEGER NOT NULL,
      bill_date DATE DEFAULT (date('now')),
      total_amount REAL NOT NULL,
      paid_amount REAL DEFAULT 0,
      balance_amount REAL NOT NULL,
      payment_ids TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (visit_id) REFERENCES visits(id),
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Clinic settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clinic_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      clinic_name TEXT NOT NULL DEFAULT 'Dental Clinic',
      address TEXT,
      phone TEXT,
      email TEXT,
      logo_path TEXT,
      tax_enabled INTEGER DEFAULT 0,
      tax_percentage REAL DEFAULT 0,
      bill_prefix TEXT DEFAULT 'INV',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('All tables created successfully');
}

// Seed initial data (default admin user and clinic settings)
function seedInitialData() {
  const bcrypt = require('bcrypt');
  
  // Check if admin user exists
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  
  if (!adminExists) {
    // Create default admin user (password: admin123)
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO users (username, password, role, name, email, phone)
      VALUES (?, ?, 'admin', 'Administrator', 'admin@clinic.com', '')
    `).run('admin', hashedPassword);
    
    console.log('Default admin user created (username: admin, password: admin123)');
  }
  
  // Check if clinic settings exist
  const settingsExist = db.prepare('SELECT id FROM clinic_settings WHERE id = 1').get();
  
  if (!settingsExist) {
    db.prepare(`
      INSERT INTO clinic_settings (id, clinic_name, address, phone, email)
      VALUES (1, 'Dental Clinic', '', '', '')
    `).run();
    
    console.log('Default clinic settings created');
  }
  
  // Seed common dental treatments if table is empty
  const treatmentCount = db.prepare('SELECT COUNT(*) as count FROM treatments_master').get();
  
  if (treatmentCount.count === 0) {
    const commonTreatments = [
      { name: 'Consultation', price: 500 },
      { name: 'Cleaning', price: 1000 },
      { name: 'Filling', price: 1500 },
      { name: 'Root Canal', price: 5000 },
      { name: 'Extraction', price: 1000 },
      { name: 'Crown', price: 8000 },
      { name: 'Scaling', price: 1200 },
      { name: 'X-Ray', price: 300 },
      { name: 'Teeth Whitening', price: 5000 },
      { name: 'Braces', price: 50000 }
    ];
    
    const insertTreatment = db.prepare(`
      INSERT INTO treatments_master (name, default_price, description)
      VALUES (?, ?, ?)
    `);
    
    commonTreatments.forEach(treatment => {
      insertTreatment.run(treatment.name, treatment.price, '');
    });
    
    console.log('Common dental treatments seeded');
  }
}

// Get database instance
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

// Close database connection
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('Database connection closed');
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase
};
