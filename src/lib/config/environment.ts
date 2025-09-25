// src/lib/config/environment.ts

import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

// ✅ Debug environment loading
const envPath = path.resolve(process.cwd(), '.env');
console.log('🔍 Current working directory:', process.cwd());
console.log('🔍 Looking for .env at:', envPath);
console.log('🔍 .env file exists:', fs.existsSync(envPath));

// ✅ Load dotenv with explicit path and debug
const dotenvResult = config({ 
  path: envPath, 
  debug: process.env.NODE_ENV === 'development' 
});

console.log('🔍 Dotenv loading result:', {
  error: dotenvResult.error?.message,
  parsed: dotenvResult.parsed ? Object.keys(dotenvResult.parsed) : 'none'
});

// ✅ Debug raw environment variables
console.log('🔍 Raw environment check:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? '***SET***' : 'MISSING');
console.log('  - SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? '***SET***' : 'MISSING');
console.log('  - SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '***SET***' : 'MISSING');
console.log('  - SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '***SET***' : 'MISSING');

export const env = {
  // Supabase
  SUPABASE_URL: 'https://fzsglqlwocsqzlpsbhte.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  
  // Spotify
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.AUTH_PORT || '8888'),
  
  // URLs - read from environment variables, use defaults as fallback
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://127.0.0.1:5173',
  BACKEND_URL: process.env.BACKEND_URL || 'http://127.0.0.1:8888',
  SERVER_BACKEND_URL: process.env.SERVER_BACKEND_URL || 'http://127.0.0.1:3001',
  
  // Feature flags
  ENABLE_LOGS: process.env.NODE_ENV === 'development',
} as const;

// ✅ Enhanced validation with better error messages
const requiredEnvVars = [
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET'
] as const;

const optionalEnvVars = [
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY'
] as const;

// Check required variables
const missingRequired: string[] = [];
for (const envVar of requiredEnvVars) {
  if (!env[envVar]) {
    missingRequired.push(envVar);
  }
}

if (missingRequired.length > 0) {
  console.error('❌ Missing required environment variables:', missingRequired);
  console.error('💡 Please check your .env file contains:');
  missingRequired.forEach(varName => {
    console.error(`   ${varName}=your_value_here`);
  });
  console.error('💡 .env file should be in:', envPath);
  throw new Error(`Missing required environment variables: ${missingRequired.join(', ')}`);
}

// Warn about missing optional variables
const missingOptional: string[] = [];
for (const envVar of optionalEnvVars) {
  if (!env[envVar]) {
    missingOptional.push(envVar);
  }
}

if (missingOptional.length > 0) {
  console.warn('⚠️  Missing optional environment variables:', missingOptional.join(', '));
}

// ✅ Configuration summary in development
if (env.NODE_ENV === 'development') {
  console.log('🔧 Environment configuration loaded:');
  console.log('   NODE_ENV:', env.NODE_ENV);
  console.log('   FRONTEND_URL:', env.FRONTEND_URL);
  console.log('   BACKEND_URL:', env.BACKEND_URL);
  console.log('   SERVER_BACKEND_URL:', env.SERVER_BACKEND_URL);
  console.log('   SUPABASE_URL:', env.SUPABASE_URL);
  console.log('   Has Supabase keys:', !!(env.SUPABASE_ANON_KEY && env.SUPABASE_SERVICE_KEY));
  console.log('   Has Spotify keys:', !!(env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET));
  console.log('   Port:', env.PORT);
  console.log('   Logs enabled:', env.ENABLE_LOGS);
}

// ✅ Export individual validation function for testing
export const validateEnvironment = () => {
  const issues: string[] = [];
  
  if (!env.SPOTIFY_CLIENT_ID) issues.push('SPOTIFY_CLIENT_ID is missing');
  if (!env.SPOTIFY_CLIENT_SECRET) issues.push('SPOTIFY_CLIENT_SECRET is missing');
  
  if (env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_ID.length < 10) {
    issues.push('SPOTIFY_CLIENT_ID appears to be invalid (too short)');
  }
  
  if (env.SPOTIFY_CLIENT_SECRET && env.SPOTIFY_CLIENT_SECRET.length < 10) {
    issues.push('SPOTIFY_CLIENT_SECRET appears to be invalid (too short)');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

// ✅ Run validation
const validation = validateEnvironment();
if (!validation.isValid) {
  console.error('❌ Environment validation failed:');
  validation.issues.forEach(issue => console.error(`   - ${issue}`));
}

console.log('✅ Environment module loaded successfully');
