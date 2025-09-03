-- init.sql
-- Creates blogs, contacts, and users tables in PostgreSQL

-- Drop tables if they already exist (optional)
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 
-- Table: blogs
-- 
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    category VARCHAR,
    content TEXT,
    tags VARCHAR,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- Table: contacts
-- ======================
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- Table: users
-- ======================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
