// js/supabaseClient.js
// Browser-side Supabase client — used by all HTML pages.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://ctokvlesbqzwnmrwhrmo.supabase.co';
const supabaseKey = 'sb_publishable_IHNiQd8cSnkEek2kKaXQ_Q_ExCgMLBs';

export const supabase = createClient(supabaseUrl, supabaseKey);