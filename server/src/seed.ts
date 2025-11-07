import { dbRun, dbAll } from './database.js';

async function clearDatabase() {
  console.log('Clearing existing data...');
  await dbRun('DELETE FROM daily_tours');
  await dbRun('DELETE FROM multi_day_tours');
  await dbRun('DELETE FROM custom_tours');
  await dbRun('DELETE FROM renting_services');
  await dbRun('DELETE FROM other_income');
  await dbRun('DELETE FROM costs');
  await dbRun('DELETE FROM assets');
  await dbRun('DELETE FROM clients');
  await dbRun('DELETE FROM settings');
  console.log('✓ Database cleared');
}

async function seedClients() {
  console.log('\nSeeding clients...');
  const clients = [
    { name: 'Hotel Metropol', email: 'info@hotelmetropol.rs', phone: '+381 11 333 5555', address: 'Bulevar kralja Aleksandra 69, Belgrade', notes: 'Regular corporate client' },
    { name: 'Green Adventures Agency', email: 'booking@greenadventures.com', phone: '+381 64 123 4567', address: 'Knez Mihailova 12, Belgrade', notes: 'Tour operator partner' },
    { name: 'Belgrade Tours Ltd', email: 'contact@belgradtours.com', phone: '+381 11 222 3333', address: 'Trg Republike 5, Belgrade', notes: 'Sends regular groups' },
    { name: 'EcoTravel Serbia', email: 'info@ecotravel.rs', phone: '+381 63 987 6543', address: 'Karadjordjeva 45, Novi Sad', notes: 'Eco-tourism focused' },
    { name: 'Adventure Seekers', email: 'hello@adventureseekers.com', phone: '+381 69 111 2222', address: 'Makedonska 23, Belgrade', notes: 'Young travelers group' },
  ];

  for (const client of clients) {
    await dbRun(
      'INSERT INTO clients (name, email, phone, address, notes) VALUES (?, ?, ?, ?, ?)',
      [client.name, client.email, client.phone, client.address, client.notes]
    );
  }
  console.log(`✓ Seeded ${clients.length} clients`);
}

async function seedDailyTours() {
  console.log('\nSeeding daily tours...');
  const tours = [
    {
      date: '2025-01-15',
      product_category: 'City Tour',
      product_subcategory: 'Historical Belgrade',
      num_pax: 12,
      price_per_pax: 45,
      income: 540,
      other_income: 50,
      commission_fee_percent: 10,
      guide1_name: 'Marko Petrovic',
      guide1_cost: 80,
      guide2_name: 'Ana Jovic',
      guide2_cost: 60,
      fb_tickets_cost: 120,
      transportation_cost: 100,
      other_cost: 30,
      income_paid: true,
      income_paid_date: '2025-01-16',
      income_category: 'Bank',
      cost_paid: true,
      cost_category: 'Bank',
      client_id: 1,
      comments: 'Great group from hotel'
    },
    {
      date: '2025-01-18',
      product_category: 'Wine Tour',
      product_subcategory: 'Sremski Karlovci',
      num_pax: 8,
      price_per_pax: 75,
      income: 600,
      other_income: 0,
      commission_fee_percent: 15,
      guide1_name: 'Nikola Savic',
      guide1_cost: 100,
      guide2_name: '',
      guide2_cost: 0,
      fb_tickets_cost: 200,
      transportation_cost: 150,
      other_cost: 20,
      income_paid: true,
      income_paid_date: '2025-01-19',
      income_category: 'Cash',
      cost_paid: true,
      cost_category: 'Cash',
      client_id: 2,
      comments: 'Wine tasting included'
    },
    {
      date: '2025-01-20',
      product_category: 'Bike Tour',
      product_subcategory: 'Danube Trail',
      num_pax: 15,
      price_per_pax: 35,
      income: 525,
      other_income: 75,
      commission_fee_percent: 10,
      guide1_name: 'Stefan Nikolic',
      guide1_cost: 70,
      guide2_name: 'Jelena Ilic',
      guide2_cost: 70,
      fb_tickets_cost: 0,
      transportation_cost: 80,
      other_cost: 50,
      income_paid: false,
      income_paid_date: '',
      income_category: 'Bank',
      cost_paid: true,
      cost_category: 'Cash',
      client_id: 3,
      comments: 'Bike rental included'
    },
    {
      date: '2025-01-22',
      product_category: 'Food Tour',
      product_subcategory: 'Belgrade Street Food',
      num_pax: 10,
      price_per_pax: 40,
      income: 400,
      other_income: 0,
      commission_fee_percent: 12,
      guide1_name: 'Marko Petrovic',
      guide1_cost: 75,
      guide2_name: '',
      guide2_cost: 0,
      fb_tickets_cost: 150,
      transportation_cost: 0,
      other_cost: 20,
      income_paid: true,
      income_paid_date: '2025-01-23',
      income_category: 'Card',
      cost_paid: true,
      cost_category: 'Cash',
      client_id: 5,
      comments: 'Walking tour'
    },
    {
      date: '2025-01-25',
      product_category: 'City Tour',
      product_subcategory: 'Novi Sad Highlights',
      num_pax: 20,
      price_per_pax: 50,
      income: 1000,
      other_income: 100,
      commission_fee_percent: 10,
      guide1_name: 'Ana Jovic',
      guide1_cost: 90,
      guide2_name: 'Nikola Savic',
      guide2_cost: 90,
      guide3_name: 'Stefan Nikolic',
      guide3_cost: 80,
      fb_tickets_cost: 180,
      transportation_cost: 200,
      other_cost: 40,
      income_paid: true,
      income_paid_date: '2025-01-26',
      income_category: 'Bank',
      cost_paid: true,
      cost_category: 'Bank',
      client_id: 1,
      comments: 'Large group tour'
    }
  ];

  for (const tour of tours) {
    const commissionAmount = tour.income * (tour.commission_fee_percent / 100);
    const totalIncome = tour.income + tour.other_income - commissionAmount;
    const totalGuideCost = tour.guide1_cost + (tour.guide2_cost || 0) + (tour.guide3_cost || 0) + (tour.guide4_cost || 0);
    const totalCost = totalGuideCost + tour.fb_tickets_cost + tour.transportation_cost + tour.other_cost;
    const totalProfit = totalIncome - totalCost;

    await dbRun(
      `INSERT INTO daily_tours (
        date, product_category, product_subcategory, num_pax, price_per_pax, income,
        other_income, total_income, commission_fee_percent,
        guide1_name, guide1_cost, guide2_name, guide2_cost, guide3_name, guide3_cost,
        guide4_name, guide4_cost, total_guide_cost, fb_tickets_cost, transportation_cost,
        other_cost, total_cost, total_profit, income_paid, income_paid_date, income_paid_category,
        cost_paid, cost_paid_category, client_id, comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tour.date, tour.product_category, tour.product_subcategory, tour.num_pax,
        tour.price_per_pax, tour.income, tour.other_income, totalIncome,
        tour.commission_fee_percent,
        tour.guide1_name, tour.guide1_cost, tour.guide2_name || '', tour.guide2_cost || 0,
        tour.guide3_name || '', tour.guide3_cost || 0, tour.guide4_name || '', tour.guide4_cost || 0,
        totalGuideCost, tour.fb_tickets_cost, tour.transportation_cost,
        tour.other_cost, totalCost, totalProfit, tour.income_paid ? 1 : 0,
        tour.income_paid_date, tour.income_category, tour.cost_paid ? 1 : 0,
        tour.cost_category, tour.client_id, tour.comments
      ]
    );
  }
  console.log(`✓ Seeded ${tours.length} daily tours`);
}

async function seedMultiDayTours() {
  console.log('\nSeeding multi-day tours...');
  const tours = [
    {
      date: '2025-01-10',
      product_category: 'Multi-day Tour',
      product_subcategory: 'Serbia Highlights 3 Days',
      num_pax: 6,
      price_per_pax: 350,
      income: 2100,
      other_income: 150,
      commission_fee_percent: 15,
      guide1_name: 'Marko Petrovic',
      guide1_cost: 300,
      fb_tickets_cost: 400,
      transportation_cost: 350,
      other_cost: 100,
      income_paid: true,
      income_paid_date: '2025-01-11',
      income_category: 'Bank',
      cost_paid: true,
      cost_category: 'Bank',
      client_id: 2,
      comments: 'Belgrade - Novi Sad - Nis'
    },
    {
      date: '2025-01-28',
      product_category: 'Weekend Tour',
      product_subcategory: 'Wine Region Weekend',
      num_pax: 4,
      price_per_pax: 220,
      income: 880,
      other_income: 0,
      commission_fee_percent: 10,
      guide1_name: 'Nikola Savic',
      guide1_cost: 200,
      fb_tickets_cost: 250,
      transportation_cost: 150,
      other_cost: 50,
      income_paid: false,
      income_paid_date: '',
      income_category: 'Bank',
      cost_paid: false,
      cost_category: 'Bank',
      client_id: 4,
      comments: 'Premium wine experience'
    }
  ];

  for (const tour of tours) {
    const commissionAmount = tour.income * (tour.commission_fee_percent / 100);
    const totalIncome = tour.income + tour.other_income - commissionAmount;
    const totalGuideCost = tour.guide1_cost;
    const totalCost = totalGuideCost + tour.fb_tickets_cost + tour.transportation_cost + tour.other_cost;
    const totalProfit = totalIncome - totalCost;

    await dbRun(
      `INSERT INTO multi_day_tours (
        date, product_category, product_subcategory, num_pax, price_per_pax, income,
        other_income, total_income, commission_fee_percent,
        guide1_name, guide1_cost, total_guide_cost, fb_tickets_cost, transportation_cost,
        other_cost, total_cost, total_profit, income_paid, income_paid_date, income_paid_category,
        cost_paid, cost_paid_category, client_id, comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tour.date, tour.product_category, tour.product_subcategory, tour.num_pax,
        tour.price_per_pax, tour.income, tour.other_income, totalIncome,
        tour.commission_fee_percent,
        tour.guide1_name, tour.guide1_cost, totalGuideCost, tour.fb_tickets_cost,
        tour.transportation_cost, tour.other_cost, totalCost, totalProfit,
        tour.income_paid ? 1 : 0, tour.income_paid_date, tour.income_category,
        tour.cost_paid ? 1 : 0, tour.cost_category, tour.client_id, tour.comments
      ]
    );
  }
  console.log(`✓ Seeded ${tours.length} multi-day tours`);
}

async function seedCustomTours() {
  console.log('\nSeeding custom tours...');
  const tours = [
    {
      date: '2025-01-12',
      product_category: 'Custom Tour',
      product_subcategory: 'Private Tesla Museum Visit',
      num_pax: 2,
      price_per_pax: 150,
      income: 300,
      other_income: 0,
      commission_fee_percent: 0,
      guide1_name: 'Ana Jovic',
      guide1_cost: 100,
      fb_tickets_cost: 50,
      transportation_cost: 40,
      other_cost: 10,
      income_paid: true,
      income_paid_date: '2025-01-12',
      income_category: 'Cash',
      cost_paid: true,
      cost_category: 'Cash',
      client_id: null,
      comments: 'Walk-in customers'
    }
  ];

  for (const tour of tours) {
    const commissionAmount = tour.income * (tour.commission_fee_percent / 100);
    const totalIncome = tour.income + tour.other_income - commissionAmount;
    const totalGuideCost = tour.guide1_cost;
    const totalCost = totalGuideCost + tour.fb_tickets_cost + tour.transportation_cost + tour.other_cost;
    const totalProfit = totalIncome - totalCost;

    await dbRun(
      `INSERT INTO custom_tours (
        date, product_category, product_subcategory, num_pax, price_per_pax, income,
        other_income, total_income, commission_fee_percent,
        guide1_name, guide1_cost, total_guide_cost, fb_tickets_cost, transportation_cost,
        other_cost, total_cost, total_profit, income_paid, income_paid_date, income_paid_category,
        cost_paid, cost_paid_category, client_id, comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tour.date, tour.product_category, tour.product_subcategory, tour.num_pax,
        tour.price_per_pax, tour.income, tour.other_income, totalIncome,
        tour.commission_fee_percent,
        tour.guide1_name, tour.guide1_cost, totalGuideCost, tour.fb_tickets_cost,
        tour.transportation_cost, tour.other_cost, totalCost, totalProfit,
        tour.income_paid ? 1 : 0, tour.income_paid_date, tour.income_category,
        tour.cost_paid ? 1 : 0, tour.cost_category, tour.client_id, tour.comments
      ]
    );
  }
  console.log(`✓ Seeded ${tours.length} custom tours`);
}

async function seedRentingServices() {
  console.log('\nSeeding renting services...');
  const services = [
    {
      date: '2025-01-16',
      product_category: 'Bike Rent',
      product_subcategory: 'Standard Bike',
      num_pax: 5,
      price_per_pax: 15,
      income: 75,
      other_income: 10,
      other_cost: 5,
      income_paid: true,
      income_paid_date: '2025-01-16',
      income_category: 'Cash',
      cost_paid: true,
      cost_category: 'Cash',
      client_id: null,
      comments: 'Daily rental'
    },
    {
      date: '2025-01-17',
      product_category: 'E-Bike Rent',
      product_subcategory: 'Electric Bike',
      num_pax: 3,
      price_per_pax: 25,
      income: 75,
      other_income: 0,
      other_cost: 10,
      income_paid: true,
      income_paid_date: '2025-01-17',
      income_category: 'Card',
      cost_paid: true,
      cost_category: 'Cash',
      client_id: null,
      comments: 'Half day rental'
    },
    {
      date: '2025-01-19',
      product_category: 'Equipment Rent',
      product_subcategory: 'Helmet & Lock',
      num_pax: 8,
      price_per_pax: 5,
      income: 40,
      other_income: 0,
      other_cost: 0,
      income_paid: true,
      income_paid_date: '2025-01-19',
      income_category: 'Cash',
      cost_paid: true,
      cost_category: 'Cash',
      client_id: null,
      comments: 'Equipment only'
    }
  ];

  for (const service of services) {
    const totalIncome = service.income + service.other_income;
    const totalCost = service.other_cost;
    const totalProfit = totalIncome - totalCost;

    await dbRun(
      `INSERT INTO renting_services (
        date, product_category, product_subcategory, num_pax, price_per_pax, income,
        other_income, total_income, other_cost, total_cost, total_profit,
        income_paid, income_paid_date, income_category, cost_paid, cost_category,
        client_id, comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        service.date, service.product_category, service.product_subcategory,
        service.num_pax, service.price_per_pax, service.income, service.other_income,
        totalIncome, service.other_cost, totalCost, totalProfit,
        service.income_paid ? 1 : 0, service.income_paid_date, service.income_category,
        service.cost_paid ? 1 : 0, service.cost_category, service.client_id, service.comments
      ]
    );
  }
  console.log(`✓ Seeded ${services.length} renting services`);
}

async function seedOtherIncome() {
  console.log('\nSeeding other income...');
  const incomes = [
    {
      date: '2025-01-05',
      description: 'Photography service for private event',
      income: 200,
      payment_date: '2025-01-05',
      income_category: 'Cash'
    },
    {
      date: '2025-01-14',
      description: 'Consulting fee for tour planning',
      income: 350,
      payment_date: '2025-01-15',
      income_category: 'Bank'
    },
    {
      date: '2025-01-21',
      description: 'Commission from hotel booking',
      income: 120,
      payment_date: '2025-01-22',
      income_category: 'Bank'
    }
  ];

  for (const income of incomes) {
    await dbRun(
      'INSERT INTO other_income (date, description, income, payment_date, income_category) VALUES (?, ?, ?, ?, ?)',
      [income.date, income.description, income.income, income.payment_date, income.income_category]
    );
  }
  console.log(`✓ Seeded ${incomes.length} other income entries`);
}

async function seedCosts() {
  console.log('\nSeeding costs...');
  const costs = [
    {
      entry_date: '2025-01-01',
      main_category: 'Fixed',
      subcategory: 'Rent',
      amount: 800,
      payment_date: '2025-01-01',
      cost_paid: true,
      cost_category: 'Bank',
      comments: 'Office rent - January'
    },
    {
      entry_date: '2025-01-01',
      main_category: 'Fixed',
      subcategory: 'Insurance',
      amount: 250,
      payment_date: '2025-01-05',
      cost_paid: true,
      cost_category: 'Bank',
      comments: 'Business insurance - January'
    },
    {
      entry_date: '2025-01-01',
      main_category: 'Fixed',
      subcategory: 'Utilities',
      amount: 150,
      payment_date: '2025-01-10',
      cost_paid: true,
      cost_category: 'Bank',
      comments: 'Electricity and water'
    },
    {
      entry_date: '2025-01-05',
      main_category: 'Variable',
      subcategory: 'Maintenance',
      amount: 180,
      payment_date: '2025-01-05',
      cost_paid: true,
      cost_category: 'Cash',
      comments: 'Bike maintenance and repairs'
    },
    {
      entry_date: '2025-01-08',
      main_category: 'Variable',
      subcategory: 'Marketing',
      amount: 300,
      payment_date: '2025-01-08',
      cost_paid: true,
      cost_category: 'Bank',
      comments: 'Facebook and Google ads'
    },
    {
      entry_date: '2025-01-12',
      main_category: 'Variable',
      subcategory: 'Fuel',
      amount: 120,
      payment_date: '2025-01-12',
      cost_paid: true,
      cost_category: 'Cash',
      comments: 'Van fuel for tours'
    },
    {
      entry_date: '2025-01-15',
      main_category: 'Variable',
      subcategory: 'Supplies',
      amount: 85,
      payment_date: '2025-01-15',
      cost_paid: true,
      cost_category: 'Cash',
      comments: 'Water bottles, maps, brochures'
    },
    {
      entry_date: '2025-01-20',
      main_category: 'Other',
      subcategory: 'Miscellaneous',
      amount: 75,
      payment_date: '2025-01-20',
      cost_paid: true,
      cost_category: 'Cash',
      comments: 'Office supplies'
    }
  ];

  for (const cost of costs) {
    await dbRun(
      `INSERT INTO costs (
        entry_date, main_category, subcategory, amount, payment_date,
        cost_paid, cost_category, comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cost.entry_date, cost.main_category, cost.subcategory, cost.amount,
        cost.payment_date, cost.cost_paid ? 1 : 0, cost.cost_category, cost.comments
      ]
    );
  }
  console.log(`✓ Seeded ${costs.length} cost entries`);
}

async function seedAssets() {
  console.log('\nSeeding assets...');
  const assets = [
    {
      entry_date: '2024-06-01',
      main_category: 'Bikes',
      subcategory: 'Standard Bike',
      amount: 3500,
      payment_date: '2024-06-01',
      paid: true,
      category: 'Bank'
    },
    {
      entry_date: '2024-06-01',
      main_category: 'Bikes',
      subcategory: 'Electric Bike',
      amount: 4500,
      payment_date: '2024-06-01',
      paid: true,
      category: 'Bank'
    },
    {
      entry_date: '2024-07-15',
      main_category: 'Vehicles',
      subcategory: 'Transport Van',
      amount: 15000,
      payment_date: '2024-07-15',
      paid: true,
      category: 'Loan'
    },
    {
      entry_date: '2024-08-01',
      main_category: 'Equipment',
      subcategory: 'Helmets and Safety Gear',
      amount: 800,
      payment_date: '2024-08-01',
      paid: true,
      category: 'Cash'
    },
    {
      entry_date: '2024-09-10',
      main_category: 'Equipment',
      subcategory: 'Communication Devices',
      amount: 600,
      payment_date: '2024-09-10',
      paid: true,
      category: 'Bank'
    }
  ];

  for (const asset of assets) {
    await dbRun(
      `INSERT INTO assets (
        entry_date, main_category, subcategory, amount, payment_date, paid, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        asset.entry_date, asset.main_category, asset.subcategory, asset.amount,
        asset.payment_date, asset.paid ? 1 : 0, asset.category
      ]
    );
  }
  console.log(`✓ Seeded ${assets.length} assets`);
}

async function seedSettings() {
  console.log('\nSeeding settings...');
  const settings = [
    { key: 'company_name', value: 'SAF Tours & Adventures' },
    { key: 'email', value: 'info@saftours.rs' },
    { key: 'phone', value: '+381 11 123 4567' },
    { key: 'address', value: 'Knez Mihailova 15, 11000 Belgrade, Serbia' },
    { key: 'tax_id', value: 'RS123456789' },
    { key: 'website', value: 'https://www.saftours.rs' },
    { key: 'bank_account', value: 'RS35160005012345678901' },
    { key: 'currency', value: 'EUR' }
  ];

  for (const setting of settings) {
    await dbRun(
      'INSERT INTO settings (key, value) VALUES (?, ?)',
      [setting.key, setting.value]
    );
  }
  console.log('✓ Seeded company settings');
}

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    await clearDatabase();
    await seedClients();
    await seedDailyTours();
    await seedMultiDayTours();
    await seedCustomTours();
    await seedRentingServices();
    await seedOtherIncome();
    await seedCosts();
    await seedAssets();
    await seedSettings();

    // Show summary
    console.log('\n📊 Database Summary:');
    const clients = await dbAll('SELECT COUNT(*) as count FROM clients');
    const dailyTours = await dbAll('SELECT COUNT(*) as count FROM daily_tours');
    const multiDayTours = await dbAll('SELECT COUNT(*) as count FROM multi_day_tours');
    const customTours = await dbAll('SELECT COUNT(*) as count FROM custom_tours');
    const rentingServices = await dbAll('SELECT COUNT(*) as count FROM renting_services');
    const otherIncome = await dbAll('SELECT COUNT(*) as count FROM other_income');
    const costs = await dbAll('SELECT COUNT(*) as count FROM costs');
    const assets = await dbAll('SELECT COUNT(*) as count FROM assets');

    console.log(`   Clients: ${clients[0].count}`);
    console.log(`   Daily Tours: ${dailyTours[0].count}`);
    console.log(`   Multi-day Tours: ${multiDayTours[0].count}`);
    console.log(`   Custom Tours: ${customTours[0].count}`);
    console.log(`   Renting Services: ${rentingServices[0].count}`);
    console.log(`   Other Income: ${otherIncome[0].count}`);
    console.log(`   Costs: ${costs[0].count}`);
    console.log(`   Assets: ${assets[0].count}`);

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
