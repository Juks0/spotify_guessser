import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
const envPath = path.resolve(process.cwd(), '.env');
console.log('🔍 Current working directory:', process.cwd());
console.log('🔍 Looking for .env at:', envPath);
console.log('🔍 .env file exists:', fs.existsSync(envPath));
const dotenvResult = config({ 
  path: envPath, 
  debug: process.env.NODE_ENV === 'development' 
});
console.log('🔍 Dotenv loading result:', {
  error: dotenvResult.error?.message,
  parsed: dotenvResult.parsed ? Object.keys(dotenvResult.parsed) : 'none'
});
console.log('🔍 Raw environment check:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? '***SET***' : 'MISSING');
console.log('  - SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? '***SET***' : 'MISSING');
console.log('  - SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '***SET***' : 'MISSING');
console.log('  - SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '***SET***' : 'MISSING');
export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.AUTH_PORT || '8888'),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8888',
  SERVER_BACKEND_URL: process.env.SERVER_BACKEND_URL || 'http://localhost:8888',
  ENABLE_LOGS: process.env.NODE_ENV === 'development',
} as const;
const requiredEnvVars = [
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY'
] as const;
const optionalEnvVars = [
  'AUTH_PORT',
  'FRONTEND_URL',
  'BACKEND_URL',
  'SERVER_BACKEND_URL'
] as const;
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
const missingOptional: string[] = [];
for (const envVar of optionalEnvVars) {
  if (!env[envVar]) {
    missingOptional.push(envVar);
  }
}
if (missingOptional.length > 0) {
  console.warn('⚠️  Missing optional environment variables:', missingOptional.join(', '));
}
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
const validation = validateEnvironment();
if (!validation.isValid) {
  console.error('❌ Environment validation failed:');
  validation.issues.forEach(issue => console.error(`   - ${issue}`));
}
console.log('✅ Environment module loaded successfully');
