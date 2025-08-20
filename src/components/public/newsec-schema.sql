-- Skapa tabeller
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  unit_number VARCHAR NOT NULL,
  size DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role VARCHAR CHECK (role IN ('admin', 'förvaltare', 'skötare')) NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL,
  priority VARCHAR CHECK (priority IN ('låg', 'normal', 'hög', 'akut')) DEFAULT 'normal',
  status VARCHAR CHECK (status IN ('reported', 'in_progress', 'done', 'closed')) DEFAULT 'reported',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id),
  description TEXT NOT NULL,
  status VARCHAR CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  frequency VARCHAR NOT NULL,
  next_due_date DATE NOT NULL,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_plans ENABLE ROW LEVEL SECURITY;

-- Corrected policy creation without IF NOT EXISTS
CREATE POLICY "Admin full access properties" ON properties FOR ALL TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admin full access users" ON users FOR ALL TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admin full access cases" ON cases FOR ALL TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Förvaltare access cases" ON cases FOR ALL TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'förvaltare');
CREATE POLICY "Skötare assigned tasks cases" ON cases FOR SELECT TO authenticated USING (assigned_to = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'förvaltare'));

-- Admin full access for tasks and maintenance
CREATE POLICY "Admin full access tasks" ON tasks FOR ALL TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admin full access maintenance_plans" ON maintenance_plans FOR ALL TO authenticated USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Task visibility: assigned user or managers
CREATE POLICY "Tasks assigned or managers" ON tasks FOR SELECT TO authenticated USING (assigned_to = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'förvaltare'));

-- Maintenance visibility: assigned user or managers
CREATE POLICY "Maintenance assigned or managers" ON maintenance_plans FOR SELECT TO authenticated USING (assigned_to = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'förvaltare'));