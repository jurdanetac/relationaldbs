CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

INSERT
  INTO blogs (author, url, title)
  VALUES (
    'Larry Page',
    'https://www.google.com',
    'Google'
  );

INSERT
  INTO blogs (author, url, title)
  VALUES (
    'Bill Gates',
    'https://www.bing.com',
    'Microsoft'
  );
