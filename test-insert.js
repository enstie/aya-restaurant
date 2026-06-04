import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Testing insert into orders...");
  const { data, error } = await supabase.from('orders').insert([{
    id: `order-${Date.now()}`,
    table_number: 1,
    items: [],
    status: 'pending',
    total_amount: 0
  }]);

  if (error) {
    console.error("Insert error details:", error);
  } else {
    console.log("Insert success:", data);
  }
}

testInsert();
