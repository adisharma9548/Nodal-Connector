#!/usr/bin/env node
/**
 * cleanup-fake-data.js
 * 
 * Safe Database Cleaner for Nodal-Connector.
 * Defaults strictly to DRY-RUN mode.
 * 
 * Execution requirements:
 * 1. Must pass --execute flag
 * 2. Must supply CONFIRM_DB_NAME environment variable exactly matching the targeted database name.
 */

const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const serverDir = path.resolve(rootDir, 'server');

function safeRequire(pkgName) {
  const possiblePaths = [
    pkgName,
    path.join(serverDir, 'node_modules', pkgName),
    path.join(rootDir, 'node_modules', pkgName)
  ];
  for (const p of possiblePaths) {
    try {
      return require(p);
    } catch (e) {}
  }
  return null;
}

const dotenv = safeRequire('dotenv');
const mongoose = safeRequire('mongoose');

if (!mongoose) {
  console.error('[Error] Mongoose could not be loaded. Please run npm install.');
  process.exit(1);
}

// Load environment from server/.env if available
if (dotenv && fs.existsSync(path.join(serverDir, '.env'))) {
  dotenv.config({ path: path.join(serverDir, '.env') });
} else if (fs.existsSync(path.join(serverDir, '.env'))) {
  // Simple fallback .env parser
  const envContent = fs.readFileSync(path.join(serverDir, '.env'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('[Error] MONGODB_URI is not set in environment or server/.env.');
  console.error('Please configure your database connection before running this cleaner.');
  process.exit(1);
}

const isExecute = process.argv.includes('--execute');
const confirmedDbName = process.env.CONFIRM_DB_NAME;

async function runCleanup() {
  console.log('====================================================');
  console.log('    Nodal-Connector: Database Cleaner Utility       ');
  console.log('====================================================');
  console.log(`Execution Mode: ${isExecute ? 'LIVE DELETION (--execute supplied)' : 'DRY RUN (Read-only simulation)'}`);

  try {
    console.log('[Info] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`[Info] Connected to database: "${dbName}"`);

    if (isExecute) {
      if (!confirmedDbName) {
        console.error('\n[HALT] Safety violation: --execute was provided, but CONFIRM_DB_NAME environment variable is missing.');
        console.error(`To proceed with live deletion, set CONFIRM_DB_NAME="${dbName}".`);
        await mongoose.disconnect();
        process.exit(1);
      }

      if (confirmedDbName !== dbName) {
        console.error(`\n[HALT] Safety violation: CONFIRM_DB_NAME ("${confirmedDbName}") does not match connected database ("${dbName}").`);
        await mongoose.disconnect();
        process.exit(1);
      }

      console.log(`[Confirmed] Database match verified: "${dbName}". Proceeding with live purge...`);
    }

    // Inspect collections for test / synthetic data
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log(`\nFound collections in ${dbName}: ${collectionNames.join(', ')}`);

    const testUserFilter = {
      $or: [
        { email: { $regex: /^test_/i } },
        { email: { $regex: /@example\.com$/i } },
        { email: { $regex: /test_notification/i } },
        { email: { $regex: /2fa_test_/i } },
        { email: { $regex: /analytics_student_/i } }
      ]
    };

    if (collectionNames.includes('users')) {
      const usersCol = db.collection('users');
      const testUsers = await usersCol.find(testUserFilter).toArray();
      console.log(`\n[Users] Identified ${testUsers.length} test / temporary account(s):`);
      testUsers.forEach(u => console.log(`  - ${u.email} (${u.role || 'no-role'}) [ID: ${u._id}]`));

      if (isExecute && testUsers.length > 0) {
        const delRes = await usersCol.deleteMany(testUserFilter);
        console.log(`  ✓ Successfully deleted ${delRes.deletedCount} user record(s).`);
      }
    }

    if (collectionNames.includes('otpverifications')) {
      const otpCol = db.collection('otpverifications');
      const otpFilter = {
        $or: [
          { email: { $regex: /^test_/i } },
          { email: { $regex: /2fa_test_/i } }
        ]
      };
      const testOtps = await otpCol.find(otpFilter).toArray();
      console.log(`\n[OTP Verifications] Identified ${testOtps.length} temporary OTP token(s).`);
      if (isExecute && testOtps.length > 0) {
        const delRes = await otpCol.deleteMany(otpFilter);
        console.log(`  ✓ Successfully deleted ${delRes.deletedCount} OTP record(s).`);
      }
    }

    console.log('\n====================================================');
    if (isExecute) {
      console.log('✓ Live database cleanup completed successfully.');
    } else {
      console.log('✓ Dry run completed. Zero changes were made to the database.');
      console.log('To execute real deletions:');
      console.log(`  CONFIRM_DB_NAME="${dbName}" node scripts/cleanup-fake-data.js --execute`);
    }
    console.log('====================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n[Database Error]', err.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

runCleanup();
