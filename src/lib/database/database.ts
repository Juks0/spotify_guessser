import { Pool } from 'pg';

const pool = new Pool({
  user: 'kacper',
  host: 'localhost',
  database: 'DatabaseSpotifyApp',
  password: '', // kacper user might not need password or use different auth
  port: 5432,
});
export default pool;


//   password: 'P@ssw0rd_771ah#3',
