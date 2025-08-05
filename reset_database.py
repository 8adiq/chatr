#!/usr/bin/env python3
"""
Script to reset the database by dropping all tables and creating fresh ones.
This will delete all data!
"""

import sqlite3
import os
from app.database import engine, Base
from app.models import User, Post, Comment, Like, EmailVerificationToken

def reset_database():
    """Drop all tables and recreate them"""
    print("⚠️  WARNING: This will delete all data in the database!")
    print("Database file:", os.path.abspath("users.db"))
    
    # Connect to database
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Get all table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    if tables:
        print(f"Found {len(tables)} existing tables:")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Drop all tables
        print("\nDropping all tables...")
        for table in tables:
            table_name = table[0]
            if table_name != 'sqlite_sequence':  # Don't drop sqlite_sequence
                cursor.execute(f"DROP TABLE IF EXISTS '{table_name}'")
                print(f"  Dropped: {table_name}")
        
        conn.commit()
        print("✅ All tables dropped successfully!")
    else:
        print("No existing tables found.")
    
    # Create all tables fresh
    print("\nCreating fresh tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")
    
    # Verify tables were created
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    new_tables = cursor.fetchall()
    print(f"\nNew tables created ({len(new_tables)}):")
    for table in new_tables:
        print(f"  - {table[0]}")
    
    conn.close()
    print("\n🎉 Database reset complete!")

if __name__ == "__main__":
    reset_database() 