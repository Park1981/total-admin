import { supabase } from '../lib/supabaseClient.js';

export async function getAll() {
  const { data, error } = await supabase
    .from('customers')
    .select('id, name, email')
    .order('id');

  if (error) {
    // Let the controller handle the error response
    throw new Error(error.message);
  }

  return data || [];
}

export async function create({ name, email }) {
  if (!name) {
    const err = new Error('Name is required');
    err.statusCode = 400; // Add status code for controller to use
    throw err;
  }

  const { data, error } = await supabase
    .from('customers')
    .insert([{ name, email }])
    .select()
    .single(); // Use .single() to get a single object back, not an array

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
