import { createClient } from "@supabase/supabase-js";

// Load environment variables
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Debugging: Log the values to see if they're loaded
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey);

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Ensure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set in your .env file."
  );
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all majors (Read)
export async function fetchMajors() {
  try {
    const { data, error } = await supabase.from("majors").select("*");
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Validate the data
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid data format: Expected an array of majors");
    }

    console.log("Fetched majors:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchMajors:", error.message);
    return [];
  }
}

export async function createMajor(newMajor) {
  try {
    const { data, error } = await supabase
      .from("majors")
      .insert([newMajor])
      .select();
    if (error) {
      console.error("Supabase insert error details:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    console.log("Created major:", data);
    return data[0]; // Return the newly created major
  } catch (error) {
    console.error("Error in createMajor:", error.message);
    throw error;
  }
}

// Update an existing major (Update)
export async function updateMajor(id, updatedMajor) {
  try {
    const { data, error } = await supabase
      .from("majors")
      .update(updatedMajor)
      .eq("id", id)
      .select();
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    console.log("Updated major:", data);
    return data[0]; // Return the updated major
  } catch (error) {
    console.error("Error in updateMajor:", error.message);
    throw error;
  }
}

// Delete a major (Delete)
export async function deleteMajor(id) {
  try {
    const { error } = await supabase.from("majors").delete().eq("id", id);
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    console.log("Deleted major with id:", id);
    return true;
  } catch (error) {
    console.error("Error in deleteMajor:", error.message);
    throw error;
  }
}
