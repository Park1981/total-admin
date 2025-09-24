import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.JEST_WORKER_ID);

function createMockSupabase() {
  const buildMutationResponse = (data = null) => ({
    select() {
      return {
        single: async () => ({ data, error: null })
      };
    },
    single: async () => ({ data, error: null })
  });

  const chain = {
    select() {
      return this;
    },
    eq() {
      return this;
    },
    order() {
      return Promise.resolve({ data: [], error: null });
    },
    insert(rows = []) {
      const firstRow = Array.isArray(rows) ? rows[0] ?? null : rows;
      return buildMutationResponse(firstRow);
    },
    update(payload = null) {
      return buildMutationResponse(payload);
    },
    delete() {
      return buildMutationResponse(null);
    },
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null })
  };

  return {
    from() {
      return chain;
    }
  };
}

if (!supabaseUrl || !supabaseKey) {
  if (!isTestEnv) {
    throw new Error('Supabase URL and Anon Key must be provided.');
  }
  console.warn('Supabase credentials missing; using mock client for tests.');
}

export const supabase = (!supabaseUrl || !supabaseKey)
  ? createMockSupabase()
  : createClient(supabaseUrl, supabaseKey);
