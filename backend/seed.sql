INSERT INTO users (first_name, last_name, email, password, is_admin)
VALUES 
('Jacob', 'Gilbert', 'jacobkgilbert@protonmail.com', 'jacob_password', true);

INSERT INTO departments (code, name)
VALUES
('p-t', 'Preaching/Teaching'),
('msc', 'Musicians'),
('prs', 'Praise Team'),
('lrc', 'Lyrics'),
('snd', 'Sound'),
('vsl', 'Visual'),
('ush', 'Ushers'),
('tch', 'Tech');

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