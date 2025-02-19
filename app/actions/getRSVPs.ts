"use server";

import { createClient } from "../utils/supabase/server";

export async function getRSVPs() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("rsvps").select("*");

  if (error) {
    console.log("Error Fetching RSVPs", error);
    return { success: false, message: "Failed to fetch RSVPs", error };
  }

  return { success: true, data };
}
