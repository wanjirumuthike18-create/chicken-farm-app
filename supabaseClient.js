// supabaseClient.js
// This file sets up a reusable connection to your Supabase project.
// Import { supabase } from wherever you need to query your database.

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_ANON_KEY. Check your .env file.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };