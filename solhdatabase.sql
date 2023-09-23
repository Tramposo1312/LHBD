-- Drop the current businesses table if it exists
DROP TABLE IF EXISTS businesses;

-- Create a new businesses table with the revised structure
CREATE TABLE businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bizname VARCHAR(60),
    bizowner VARCHAR(60),
    goods INTEGER,
    lastincometime TIMESTAMP,
    biztype VARCHAR(60),
    income INTEGER,
    taxes INTEGER,
    influencepoints INTEGER
);
