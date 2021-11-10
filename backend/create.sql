\echo 'Delete and recreate church_planner db?' 
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE church_planner;
CREATE DATABASE church_planner;
\connect church_planner 

\i schema.sql
\i seed.sql

\echo 'Delete and recreate church_planner_test db?' 
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE church_planner_test;
CREATE DATABASE church_planner_test;
\connect church_planner_test 

\i schema.sql