import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, '../database.sqlite');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Promisified database methods
export const dbRun = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const initializeDatabase = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS daily_tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      product_category TEXT,
      product_subcategory TEXT,
      num_pax INTEGER,
      price_per_pax REAL,
      income REAL,
      other_income REAL,
      commission_fee_percent REAL DEFAULT 0,
      total_income REAL,
      guide1_name TEXT,
      guide1_cost REAL,
      guide2_name TEXT,
      guide2_cost REAL,
      guide3_name TEXT,
      guide3_cost REAL,
      guide4_name TEXT,
      guide4_cost REAL,
      total_guide_cost REAL,
      fb_tickets_cost REAL,
      transportation_cost REAL,
      other_cost REAL,
      total_cost REAL,
      total_profit REAL,
      income_paid BOOLEAN DEFAULT 0,
      income_paid_date DATE,
      income_paid_category TEXT,
      cost_paid BOOLEAN DEFAULT 0,
      cost_paid_category TEXT,
      booking_platform TEXT,
      client_id INTEGER,
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS multi_day_tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      product_category TEXT,
      product_subcategory TEXT,
      num_pax INTEGER,
      price_per_pax REAL,
      income REAL,
      other_income REAL,
      commission_fee_percent REAL DEFAULT 0,
      total_income REAL,
      guide1_name TEXT,
      guide1_cost REAL,
      guide2_name TEXT,
      guide2_cost REAL,
      guide3_name TEXT,
      guide3_cost REAL,
      guide4_name TEXT,
      guide4_cost REAL,
      total_guide_cost REAL,
      fb_tickets_cost REAL,
      transportation_cost REAL,
      other_cost REAL,
      total_cost REAL,
      total_profit REAL,
      income_paid BOOLEAN DEFAULT 0,
      income_paid_date DATE,
      income_paid_category TEXT,
      cost_paid BOOLEAN DEFAULT 0,
      cost_paid_category TEXT,
      booking_platform TEXT,
      client_id INTEGER,
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS renting_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      product_category TEXT,
      product_subcategory TEXT,
      num_pax INTEGER,
      price_per_pax REAL,
      income REAL,
      other_income REAL,
      total_income REAL,
      other_cost REAL,
      total_cost REAL,
      total_profit REAL,
      income_paid BOOLEAN DEFAULT 0,
      income_paid_date DATE,
      income_category TEXT,
      cost_paid BOOLEAN DEFAULT 0,
      cost_category TEXT,
      client_id INTEGER,
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS custom_tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      product_category TEXT,
      product_subcategory TEXT,
      num_pax INTEGER,
      price_per_pax REAL,
      income REAL,
      other_income REAL,
      commission_fee_percent REAL DEFAULT 0,
      total_income REAL,
      guide1_name TEXT,
      guide1_cost REAL,
      guide2_name TEXT,
      guide2_cost REAL,
      guide3_name TEXT,
      guide3_cost REAL,
      guide4_name TEXT,
      guide4_cost REAL,
      total_guide_cost REAL,
      fb_tickets_cost REAL,
      transportation_cost REAL,
      other_cost REAL,
      total_cost REAL,
      total_profit REAL,
      income_paid BOOLEAN DEFAULT 0,
      income_paid_date DATE,
      income_paid_category TEXT,
      cost_paid BOOLEAN DEFAULT 0,
      cost_paid_category TEXT,
      booking_platform TEXT,
      client_id INTEGER,
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS other_income (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      description TEXT,
      income REAL,
      payment_date DATE,
      income_category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS costs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_date DATE NOT NULL,
      main_category TEXT NOT NULL,
      subcategory TEXT,
      amount REAL,
      payment_date DATE,
      cost_paid BOOLEAN DEFAULT 0,
      cost_category TEXT,
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_date DATE NOT NULL,
      main_category TEXT,
      subcategory TEXT,
      amount REAL,
      payment_date DATE,
      paid BOOLEAN DEFAULT 0,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE,
      client_id INTEGER,
      date DATE NOT NULL,
      due_date DATE,
      type TEXT CHECK(type IN ('domestic', 'foreign')),
      items TEXT,
      subtotal REAL,
      tax_rate REAL,
      tax_amount REAL,
      total REAL,
      status TEXT DEFAULT 'draft',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      parent_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES categories(id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully');
};
