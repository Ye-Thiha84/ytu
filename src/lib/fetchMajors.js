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

// Valid categories for validation
const VALID_CATEGORIES = ["science", "art"];

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

    // Validate category values and new fields
    data.forEach((major) => {
      // Validate category
      if (major.category && !VALID_CATEGORIES.includes(major.category)) {
        console.warn(
          `Invalid category for major ${major.id}: ${major.category}`
        );
      }
      // Validate career_opportunities
      if (
        major.career_opportunities &&
        !Array.isArray(major.career_opportunities)
      ) {
        console.warn(
          `Invalid career_opportunities for major ${
            major.id
          }: Expected an array, got ${typeof major.career_opportunities}`
        );
      }
      // Validate why_choose
      if (major.why_choose && typeof major.why_choose !== "string") {
        console.warn(
          `Invalid why_choose for major ${
            major.id
          }: Expected a string, got ${typeof major.why_choose}`
        );
      }
    });

    console.log("Fetched majors:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchMajors:", error.message);
    return [];
  }
}

// Create a new major (Create)
export async function createMajor(newMajor) {
  try {
    // Validate category
    if (newMajor.category && !VALID_CATEGORIES.includes(newMajor.category)) {
      throw new Error(
        `Invalid category: Must be one of ${VALID_CATEGORIES.join(", ")}`
      );
    }
    // Validate career_opportunities
    if (
      newMajor.career_opportunities &&
      !Array.isArray(newMajor.career_opportunities)
    ) {
      throw new Error("career_opportunities must be an array");
    }
    // Validate why_choose
    if (newMajor.why_choose && typeof newMajor.why_choose !== "string") {
      throw new Error("why_choose must be a string");
    }

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
    // Validate category
    if (
      updatedMajor.category &&
      !VALID_CATEGORIES.includes(updatedMajor.category)
    ) {
      throw new Error(
        `Invalid category: Must be one of ${VALID_CATEGORIES.join(", ")}`
      );
    }
    // Validate career_opportunities
    if (
      updatedMajor.career_opportunities &&
      !Array.isArray(updatedMajor.career_opportunities)
    ) {
      throw new Error("career_opportunities must be an array");
    }
    // Validate why_choose
    if (
      updatedMajor.why_choose &&
      typeof updatedMajor.why_choose !== "string"
    ) {
      throw new Error("why_choose must be a string");
    }

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
