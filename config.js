import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',          
  host: 'postgres', 
  database: 'postgres',           
  password: 'postgres',        
  port: 5432,                   
})

export default pool