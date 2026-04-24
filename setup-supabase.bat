@echo off
REM Supabase Table Setup Script for Windows
REM This script creates all required tables using Supabase CLI

echo Installing Supabase CLI...
npm install -g supabase

echo.
echo ================================
echo Supabase Setup Instructions
echo ================================
echo.
echo 1. Get your Supabase Access Token:
echo    - Go to https://app.supabase.com
echo    - Click your profile icon (top right)
echo    - Settings → Access Tokens
echo    - Copy your personal access token
echo.
echo 2. Set the token:
echo    set SUPABASE_ACCESS_TOKEN=your_token_here
echo.
echo 3. Initialize Supabase:
echo    supabase init
echo.
echo 4. Create migration:
echo    supabase migration new create_jharkhand_tourism_tables
echo.
echo 5. Copy content from SUPABASE_SQL_SETUP.sql to the migration file
echo.
echo 6. Run migration:
echo    supabase migration up
echo.
echo ================================
echo Or use the simpler method:
echo ================================
echo.
echo 1. Go to Supabase Dashboard
echo 2. Click "SQL Editor"
echo 3. Click "New Query"
echo 4. Copy-paste all SQL from SUPABASE_SQL_SETUP.sql
echo 5. Click "Run"
echo.
