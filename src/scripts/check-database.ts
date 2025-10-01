#!/usr/bin/env tsx

// Database health check script
import { checkDatabaseHealth } from '../lib/database/database.js';
import { testDirectConnection } from '../lib/database/supabase.js';

async function main() {
  console.log('🔍 Checking database connections...');
  
  try {
    // Test Supabase API connection
    console.log('📡 Testing Supabase API connection...');
    const health = await checkDatabaseHealth();
    
    if (!health.isHealthy) {
      console.error('❌ Supabase API connection failed:', health.message);
      if (health.details) {
        console.error('📊 Details:', health.details);
      }
      process.exit(1);
    }
    
    console.log('✅ Supabase API connection successful');
    
    // Test direct PostgreSQL connection (Supavisor transaction mode)
    console.log('🔗 Testing direct PostgreSQL connection (Supavisor transaction mode)...');
    const directConnection = await testDirectConnection();
    
    if (!directConnection) {
      console.error('❌ Direct PostgreSQL connection failed');
      process.exit(1);
    }
    
    console.log('✅ All database connections successful!');
    console.log('📊 Connection methods tested:');
    console.log('   - Supabase API (REST/GraphQL)');
    console.log('   - Direct PostgreSQL (Supavisor transaction mode)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database check failed:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
