"use server";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

// Sign In Function
export async function signIn(
  prevState: { error: string } | null,
  formData: FormData
) {
  // Extract email and password from form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Create Supabase client
  const supabase = await createClient();

  // Attempt to sign in with email and password
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Log the response data for debugging
  console.log(data, "data_login");

  // Handle errors during sign-in
  if (error) {
    return { error: error.message };
  }

  // Redirect to the admin dashboard on successful sign-in
  redirect("/admin/rsvps");
}

// Sign Out Function
export const signOut = async () => {
  // Create Supabase client
  const supabase = await createClient();

  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to the login page
  redirect("/login");
};