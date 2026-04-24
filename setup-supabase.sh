#!/bin/bash

# Supabase Table Setup Script
# This script creates all required tables using Supabase CLI

# Install Supabase CLI if not already installed
# npm install -g supabase

# Make sure you have the SUPABASE_ACCESS_TOKEN set
# export SUPABASE_ACCESS_TOKEN=your_supabase_access_token

# Initialize Supabase (if not already done)
# supabase init

# Run migrations
supabase migration new create_jharkhand_tourism_tables

# Copy the SQL content to supabase/migrations/[timestamp]_create_jharkhand_tourism_tables.sql
# Then run:

supabase migration up
