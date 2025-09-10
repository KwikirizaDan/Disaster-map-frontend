import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://octkvcsgjspzptmzkwtn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdGt2Y3NnanNwenB0bXprd3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MTUxNzgsImV4cCI6MjA3MzA5MTE3OH0.zPsPy0oHa7hcNJgxmADkvdeevkOqadSdZNCmD7jy880'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
