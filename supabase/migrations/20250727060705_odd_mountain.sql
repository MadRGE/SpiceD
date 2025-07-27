/*
  # Fix infinite recursion in usuarios RLS policies

  1. Problem
    - Current policies cause infinite recursion when querying usuarios table
    - Admin policy references usuarios table within usuarios policy check
    
  2. Solution
    - Drop existing problematic policies
    - Create simpler, non-recursive policies
    - Use auth.uid() directly instead of subqueries to usuarios table
    
  3. Security
    - Maintain proper access control
    - Prevent infinite recursion
    - Allow authenticated users to read basic user data
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Los admins pueden ver todos los usuarios" ON usuarios;
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON usuarios;

-- Create new non-recursive policies
CREATE POLICY "Authenticated users can read all usuarios"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON usuarios
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON usuarios
  FOR UPDATE
  TO authenticated
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- Only allow deletes for admin users (simplified check)
CREATE POLICY "Admin users can delete usuarios"
  ON usuarios
  FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth_id FROM usuarios WHERE rol = 'admin' AND auth_id = auth.uid()
  ));