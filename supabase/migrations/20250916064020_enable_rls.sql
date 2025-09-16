-- Enable RLS and create policies for customers table

-- Enable RLS on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to read customers
CREATE POLICY "Allow anonymous read access" ON public.customers
  FOR SELECT
  TO anon
  USING (true);

-- Create policy to allow anonymous users to insert customers
CREATE POLICY "Allow anonymous insert access" ON public.customers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Grant necessary permissions to anon role
GRANT ALL ON public.customers TO anon;
GRANT USAGE ON SEQUENCE public.customers_id_seq TO anon;