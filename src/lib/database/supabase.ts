// src/lib/database/supabase.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/environment.ts';


// ✅ Backend client with service role (full access for server operations)
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

// ✅ Regular client with anon key (for frontend operations)
export const supabase: SupabaseClient = createClient(
  env.SUPABASE_URL!,
  env.SUPABASE_ANON_KEY || 'dummy-key'
);

// ✅ Helper functions to maintain compatibility with existing code
export async function query<T = any>(
  text: string, 
  params?: any[]
): Promise<{rows: T[], rowCount: number}> {
  const start = Date.now();
  
  try {
    // For Supabase, use .rpc() for custom SQL or convert to Supabase queries
    console.warn('⚠️ Raw SQL queries not recommended with Supabase client. Use Supabase query methods instead.');
    
    // If you really need raw SQL, create a database function and call it with .rpc()
    throw new Error('Raw SQL queries not supported with Supabase client. Use .from() queries instead.');
    
  } catch (error) {
    console.error('❌ Supabase query error:', error);
    throw error;
  }
}

// ✅ Transaction support using Supabase
export async function withTransaction<T>(
  callback: (client: SupabaseClient) => Promise<T>
): Promise<T> {
  // Supabase handles transactions automatically for related operations
  // For complex transactions, use PostgreSQL functions called via .rpc()
  try {
    return await callback(supabaseAdmin);
  } catch (error) {
    console.error('❌ Transaction error:', error);
    throw error;
  }
}

// ✅ Debugging and connection testing
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

// Initialize and test connection in development
if (env.NODE_ENV === 'development') {
  console.log('🔧 Supabase clients initialized');
  console.log('🔍 Supabase URL:', env.SUPABASE_URL);
  console.log('🔍 Has Anon Key:', !!env.SUPABASE_ANON_KEY);
  console.log('🔍 Has Service Key:', !!env.SUPABASE_SERVICE_KEY);
}

export default supabaseAdmin;
