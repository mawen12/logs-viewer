DROP TABLE IF EXISTS sources;

CREATE TABLE sources 
(
    source_id    INTEGER PRIMARY KEY,
    source_name  TEXT NOT NULL,
    source_group TEXT NOT NULL,
    source       TEXT NOT NULL,
    pattern      TEXT,
    UNIQUE (source_name, source_group)
);

-- INSERT INTO sources (source_name, source_group, source) 
-- VALUES (1,1,1), (2,2,2), (3,3,3), (4,4,4), (5,5,5), (6,6,6), (7,7,7), (8,8,8)
-- , (9,9,9), (10,10,10), (11,11,11), (12,12,12), (13,13,13), (14,14,14), (15,15,15)
-- , (16,16,16), (17,17,17), (18,18,18), (19,19,19), (20,20,20), (21, 21, 21), (22, 22, 22)
-- , (23, 23, 23), (24, 24, 24), (25, 25, 25);

INSERT INTO sources (source_name, source_group, source) 
VALUES ('app.log', 'local', 'cmd://127.0.0.1:/Users/mawen/logs/app.log'),
('single.log', 'local', 'cmd://127.0.0.1:/Users/mawen/logs/single.log'),
('monitor.log', 'local', 'cmd://127.0.0.1:/Users/mawen/logs/monitor.log'),
('app.log', 'remote', 'ssh://root:admin@192.168.122.6:22:/root/logs/app.log'),
('bpp.log', 'remote', 'ssh://root:admin@192.168.122.6:22:/root/logs/bpp.log'),
('monitor-stat.log', 'remote', 'ssh://root:admin@192.168.122.6:22:/root/logs/monitor-stat.log');



