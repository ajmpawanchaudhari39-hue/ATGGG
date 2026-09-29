import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const { Client } = pg;

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yyxmsptxdsltpsabtffm.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

// Path to migration file
const migrationFilePath = path.resolve(__dirname, '../../supabase/migrations/001_initial_schema.sql');

console.log("\n========================================================");
console.log("⚡ INTERRO-GATE AI // SUPABASE MIGRATION RUNNER");
console.log("========================================================");
console.log(`📁 Migration File: ${migrationFilePath}`);
console.log(`🌐 Supabase URL:   ${SUPABASE_URL}`);

async function runMigration() {
  if (!fs.existsSync(migrationFilePath)) {
    console.error(`❌ Migration file not found at: ${migrationFilePath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(migrationFilePath, 'utf8');

  // STRATEGY 1: Direct PostgreSQL Connection via DATABASE_URL
  if (DATABASE_URL && !DATABASE_URL.includes('[YOUR-PASSWORD]')) {
    console.log("\n🔌 Connecting directly to PostgreSQL via DATABASE_URL...");
    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log("✅ Connected to Supabase PostgreSQL database.");
      console.log("⏳ Applying 001_initial_schema.sql...");
      await client.query(sqlContent);
      console.log("🎉 Successfully executed migration on Supabase Cloud!");
      await client.end();
      await verifyTablesWithClient();
      return;
    } catch (err) {
      console.error("❌ Postgres direct query failed:", err.message);
      try { await client.end(); } catch (_) {}
    }
  }

  // STRATEGY 2: Supabase Management / SQL API using Service Role Key
  if (SERVICE_ROLE_KEY && SERVICE_ROLE_KEY !== 'your_supabase_service_role_key') {
    console.log("\n🔑 Attempting SQL execution via Supabase API with Service Role Key...");
    
    // Method 2a: Management query API
    const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
    const managementEndpoints = [
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      `${SUPABASE_URL}/pg/query`,
      `${SUPABASE_URL}/rest/v1/rpc/exec_sql`
    ];

    let appliedViaApi = false;

    for (const endpoint of managementEndpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({ query: sqlContent, sql: sqlContent })
        });

        if (res.ok) {
          console.log(`✅ Applied schema via endpoint: ${endpoint}`);
          appliedViaApi = true;
          break;
        }
      } catch (e) {
        // Continue to next endpoint attempt
      }
    }

    if (appliedViaApi) {
      await verifyTablesWithClient();
      return;
    }
  }

  // STRATEGY 3: Check Current Table Existence via Supabase JS Client & Provide Quick Guide
  console.log("\n🔍 Checking table status on Supabase project...");
  await verifyTablesWithClient();

  console.log("\n--------------------------------------------------------");
  console.log("📋 QUICK APPLY INSTRUCTIONS FOR SUPABASE CLOUD:");
  console.log("--------------------------------------------------------");
  console.log(`1. Open your Supabase Project Dashboard:`);
  console.log(`   👉 https://supabase.com/dashboard/project/yyxmsptxdsltpsabtffm/sql/new`);
  console.log(`2. Paste the contents of:`);
  console.log(`   /supabase/migrations/001_initial_schema.sql`);
  console.log(`3. Click 'Run' to apply all tables, RLS policies, and triggers!`);
  console.log("\n💡 Or set your database password in server/.env:");
  console.log(`   DATABASE_URL=postgresql://postgres.yyxmsptxdsltpsabtffm:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`);
  console.log("   And run: npm run migrate (inside server/)");
  console.log("========================================================\n");
}

async function verifyTablesWithClient() {
  const keyToUse = SERVICE_ROLE_KEY && SERVICE_ROLE_KEY !== 'your_supabase_service_role_key'
    ? SERVICE_ROLE_KEY
    : process.env.SUPABASE_ANON_KEY;

  if (!keyToUse) {
    console.log("ℹ️  No active Supabase key to verify tables. Please configure SUPABASE_SERVICE_ROLE_KEY in server/.env.");
    return;
  }

  const supabase = createClient(SUPABASE_URL, keyToUse);
  const tables = [
    'profiles',
    'negotiation_sessions',
    'negotiation_logs',
    'stress_test_results',
    'resume_roasts'
  ];

  console.log("\n📊 TABLE STATUS VERIFICATION:");
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        if (error.code === '42P01') {
          console.log(`   ⚪ public.${table.padEnd(22)} ➜ Not yet created in cloud`);
        } else {
          console.log(`   ⚠️ public.${table.padEnd(22)} ➜ Status: ${error.message}`);
        }
      } else {
        console.log(`   🟢 public.${table.padEnd(22)} ➜ Ready & Active on Cloud`);
      }
    } catch (e) {
      console.log(`   ⚪ public.${table.padEnd(22)} ➜ Pending execution`);
    }
  }
}

runMigration().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
