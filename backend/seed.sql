INSERT INTO users (first_name, last_name, email, password, is_admin, is_dept_head)
VALUES 
('Test', 'User', 'user@test.com', '$2y$12$JYxWVdddVj5E/enkP0D.Me3YIdBuefaIno54miXF8gg8XlDtXe5Vm', false, false),
('Test', 'Admin', 'admin@test.com', '$2y$12$JYxWVdddVj5E/enkP0D.Me3YIdBuefaIno54miXF8gg8XlDtXe5Vm', true, false),
('Test', 'DeptHead', 'depthead@test.com', '$2y$12$JYxWVdddVj5E/enkP0D.Me3YIdBuefaIno54miXF8gg8XlDtXe5Vm', false, true);

INSERT INTO departments (code, name, dept_head)
VALUES
('p-t', 'Preaching/Teaching', null),
('msc', 'Musicians', null),
('prs', 'Praise Team', null),
('lrc', 'Lyrics', null),
('snd', 'Sound', null),
('vsl', 'Visual', null),
('ush', 'Ushers', null),
('tch', 'Tech', 3);

INSERT INTO positions (code, name, dept_code)
VALUES
('pch', 'Preacher', 'p-t'),
('tch', 'Teacher', 'p-t'),
('sop', 'Soprano', 'prs'),
('alt', 'Alto', 'prs'),
('tnr', 'Tenor', 'prs'),
('bar', 'Baritone', 'prs'),
('bss', 'Bass', 'msc'),
('gtr', 'Guitar', 'msc'),
('bgtr', 'Bass Guitar', 'msc'),
('pno', 'Piano', 'msc'),
('org', 'Organ', 'msc'),
('drm', 'Drums', 'msc'),
('tmb', 'Trombone', 'msc'),
('soc', 'Social', 'tch'),
('web', 'Website', 'tch'),
('sopr', 'Sound Operator', 'snd'),
('vopr', 'Camera Operator', 'vsl');

INSERT INTO events (date, dept_code)
VALUES
('2020-01-22', 'snd'),
('2022-12-11', 'p-t'),
('2022-12-10', 'snd');

INSERT INTO dept_volunteers (dept_code, user_id)
VALUES
('snd', 1),
('p-t', 1);

INSERT INTO user_position (user_id, position_code)
VALUES
(1, 'sopr'),
(1, 'tch');

INSERT INTO events_volunteers (user_id, event_id, position_code)
VALUES
(1, 1, 'sopr'),
(1, 2, 'tch'),
(1, 3, 'sopr');

INSERT INTO unavailable (start_date, end_date, user_id)
VALUES
('2022-01-23', '2022-01-24', 1);