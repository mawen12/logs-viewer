DROP TABLE IF EXISTS sources;

CREATE TABLE sources 
(
    source_id    INTEGER PRIMARY KEY,
    source_name  TEXT UNIQUE,
    source_group TEXT NOT NULL,
    source       TEXT NOT NULL,
    UNIQUE (source_name, source_group)
);

INSERT INTO sources (source_name, source_group, source) 
VALUES (1,1,1), (2,2,2), (3,3,3), (4,4,4), (5,5,5), (6,6,6), (7,7,7), (8,8,8)
, (9,9,9), (10,10,10), (11,11,11), (12,12,12), (13,13,13), (14,14,14), (15,15,15)
, (16,16,16), (17,17,17), (18,18,18), (19,19,19), (20,20,20);