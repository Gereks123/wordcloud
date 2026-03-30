CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE submissions (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    filename     VARCHAR(255) NOT NULL,
    status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    total_chunks INTEGER,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE word_counts (
    id            BIGSERIAL    PRIMARY KEY,
    submission_id UUID         NOT NULL REFERENCES submissions(id),
    word          VARCHAR(255) NOT NULL,
    count         INTEGER      NOT NULL,
    UNIQUE (submission_id, word)
);

CREATE INDEX idx_word_counts_submission ON word_counts(submission_id);
