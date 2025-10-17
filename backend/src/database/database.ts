// Database configuration and connection utilities
import { testConnection, testDirectConnection } from './supabase';

export { testConnection, testDirectConnection };

// Database health check function
export async function checkDatabaseHealth(): Promise<{
  isHealthy: boolean;
  message: string;
  details?: any;
}> {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      return {
        isHealthy: true,
        message: 'Database connection successful',
        details: {
          provider: 'Supabase',
          timestamp: new Date().toISOString()
        }
      };
    } else {
      return {
        isHealthy: false,
        message: 'Database connection failed',
        details: {
          provider: 'Supabase',
          timestamp: new Date().toISOString()
        }
      };
    }
  } catch (error) {
    return {
      isHealthy: false,
      message: `Database check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        provider: 'Supabase',
        timestamp: new Date().toISOString(),
        error: error
      }
    };
  }
}

// Export for use in other modules
export default {
  checkDatabaseHealth,
  testConnection
};
