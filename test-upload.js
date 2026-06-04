import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log("Testing upload...");
  // Create a dummy text file buffer
  const buffer = Buffer.from("test file content");
  
  const { data, error } = await supabase.storage
    .from('menu-images')
    .upload('test.txt', buffer, {
      contentType: 'text/plain',
      upsert: true
    });

  if (error) {
    console.error("Upload error details:", error);
  } else {
    console.log("Upload success:", data);
  }
}

testUpload();
