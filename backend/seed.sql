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

INSERT INTO positions (code, name)
VALUES
('pch', 'Preacher'),
('tch', 'Teacher'),
('sop', 'Soprano'),
('alt', 'Alto'),
('tnr', 'Tenor'),
('bar', 'Baritone'),
('bss', 'Bass'),
('gtr', 'Guitar'),
('bgtr', 'Bass Guitar'),
('pno', 'Piano'),
('org', 'Organ'),
('drm', 'Drums'),
('tmb', 'Trombone'),
('soc', 'Social'),
('web', 'Website'),
('opr', 'Operator');