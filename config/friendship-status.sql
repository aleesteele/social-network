DROP TABLE IF EXISTS fstatus;

CREATE TABLE fstatus(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    reciever_id INTEGER NOT NULL,
    status INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- userId - userId
-- req_id - userId of person requesting

-- user_status
-- NULL
-- 0 - NO FRIENDSHIP
-- 1 - PENDING
-- 2 - ACCEPTED
-- 3 - TERMINATED
