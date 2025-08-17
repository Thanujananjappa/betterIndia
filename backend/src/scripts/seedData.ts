import { connectDB } from '../utils/database';
import { Police } from '../models/PoliceCase';
import { NGO } from '../models/NGOCase';
import { CCTV } from '../models/cctvCase';

const seed = async () => {
  await connectDB();

  await Police.insertMany([
    { stationName: 'Central Police Station', address: 'Main Street, City', contactNumber: '1234567890', jurisdictionArea: 'Central City' }
  ]);

  await NGO.insertMany([
    { name: 'Helping Hands', focusArea: 'Missing Persons', contactNumber: '9876543210', address: 'NGO Street, City' }
  ]);

  await CCTV.insertMany([
    { location: 'Central Railway Station', type: 'railway', ipAddress: '192.168.1.10', accessURL: 'http://cctv.local/railway' }
  ]);

  console.log('✅ Data seeded successfully');
  process.exit();
};

seed();
