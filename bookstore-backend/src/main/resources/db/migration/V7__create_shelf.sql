CREATE TABLE shelf_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'TO_READ',
    current_page INTEGER DEFAULT 0,
    rating INTEGER,
    review TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);