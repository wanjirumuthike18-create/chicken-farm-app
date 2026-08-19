require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_ANON_KEY. Check your .env file.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { disabled: true }
});

async function testConnection() {
  console.log('Testing connection to Supabase...');

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.log('❌ Connection failed:', error.message);
    return;
  }

  console.log('✅ Successfully connected to Supabase!');
  console.log('Project URL:', supabaseUrl);
}

testConnection();

