import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/environment.ts';
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL!,
  env.SUPABASE_SERVICE_KEY || 'dummy-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
export const supabase: SupabaseClient = createClient(
  env.SUPABASE_URL!,
  env.SUPABASE_ANON_KEY || 'dummy-key'
);
export async function query<T = any>(
  text: string, 
  params?: any[]
): Promise<{rows: T[], rowCount: number}> {
  const start = Date.now();
  try {
    console.warn('⚠️ Raw SQL queries not recommended with Supabase client. Use Supabase query methods instead.');
    throw new Error('Raw SQL queries not supported with Supabase client. Use .from() queries instead.');
  } catch (error) {
    console.error('❌ Supabase query error:', error);
    throw error;
  }
}
export async function withTransaction<T>(
  callback: (client: SupabaseClient) => Promise<T>
): Promise<T> {
  try {
    return await callback(supabaseAdmin);
  } catch (error) {
    console.error('❌ Transaction error:', error);
    throw error;
  }
}
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count', { count: 'exact', head: true });
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return false;
    }
    if (env.ENABLE_LOGS) {
      console.log('✅ Supabase connection successful');
    }
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
}

// Test direct PostgreSQL connection using Supavisor transaction mode
export async function testDirectConnection(): Promise<boolean> {
  try {
    const { Pool } = await import('pg');
    
    // Get connection string from environment
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return false;
    }

    // Create pool with transaction mode settings
    const pool = new Pool({
      connectionString,
      // Transaction mode settings
      max: 1, // Single connection for transaction mode
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 10000,
      // Disable prepared statements for transaction mode
      statement_timeout: 0,
      query_timeout: 0,
    });

    // Test connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as now, version() as version');
    client.release();
    await pool.end();

    if (env.ENABLE_LOGS) {
      console.log('✅ Direct PostgreSQL connection successful');
      console.log('📊 Database time:', result.rows[0].now);
      console.log('📊 PostgreSQL version:', result.rows[0].version);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Direct PostgreSQL connection failed:', error);
    return false;
  }
}
if (env.NODE_ENV === 'development') {
  console.log('🔧 Supabase clients initialized');
  console.log('🔍 Supabase URL:', env.SUPABASE_URL);
  console.log('🔍 Has Anon Key:', !!env.SUPABASE_ANON_KEY);
  console.log('🔍 Has Service Key:', !!env.SUPABASE_SERVICE_KEY);
}
export default supabaseAdmin;
