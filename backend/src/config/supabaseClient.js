import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("ENV CHECK:", {
    SUPABASE_URL: supabaseUrl,
    SUPABASE_ANON_KEY: supabaseKey ? "Exists" : "Missing"
  });

  throw new Error("Supabase environment variables are missing");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;