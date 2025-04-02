
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL CHECK (LENGTH(first_name) >= 4 AND LENGTH(first_name) <= 50),
  last_name VARCHAR(50),
  email_id VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  age INTEGER CHECK (age >= 18),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  photo_url VARCHAR(255) DEFAULT 'https://geographyandyou.com/images/user-profile.png',
  about TEXT DEFAULT 'This is a default about of the user!',
  skills TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--  Create the connection_requests table
CREATE TABLE connection_requests (
  id SERIAL PRIMARY KEY,
  from_user_id INT NOT NULL,         
  to_user_id INT NOT NULL,           --
  status VARCHAR(20) NOT NULL,       
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  CONSTRAINT fk_from_user FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_to_user FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Add a check constraint for status
  CONSTRAINT status_check CHECK (status IN ('ignored', 'interested', 'accepted', 'rejected')),

  -- Ensure a user cannot send a request to themselves (this check must be done at the application level)
  CONSTRAINT no_self_request CHECK (from_user_id <> to_user_id)
);

-- Index to improve query performance
CREATE INDEX idx_connection_request_user ON connection_requests(from_user_id, to_user_id);


-- Create chats table
CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_participants junction table (for many-to-many relationship)
CREATE TABLE chat_participants (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chat_id, user_id)
);

-- Create messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_chat_participants_chat_id ON chat_participants(chat_id);
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update timestamps
CREATE TRIGGER update_chats_timestamp
BEFORE UPDATE ON chats
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_messages_timestamp
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();