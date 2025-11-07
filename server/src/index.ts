import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database';
import clientsRouter from './routes/clients';
import dailyToursRouter from './routes/dailyTours';
import multiDayToursRouter from './routes/multiDayTours';
import rentingServicesRouter from './routes/rentingServices';
import customToursRouter from './routes/customTours';
import otherIncomeRouter from './routes/otherIncome';
import costsRouter from './routes/costs';
import assetsRouter from './routes/assets';
import invoicesRouter from './routes/invoices';
import categoriesRouter from './routes/categories';
import reportsRouter from './routes/reports';
import settingsRouter from './routes/settings';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/clients', clientsRouter);
app.use('/api/daily-tours', dailyToursRouter);
app.use('/api/multi-day-tours', multiDayToursRouter);
app.use('/api/renting-services', rentingServicesRouter);
app.use('/api/custom-tours', customToursRouter);
app.use('/api/other-income', otherIncomeRouter);
app.use('/api/costs', costsRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/settings', settingsRouter);

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
