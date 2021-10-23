\echo 'Delete and recreate jobly db?' 
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE alupc_planner;
CREATE DATABASE alupc_planner;
\connect alupc_planner 

\i schema.sql
\i seed.sql

\echo 'Delete and recreate jobly_test db?' 
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE alupc_planner_test;
CREATE DATABASE alupc_planner_test;
\connect alupc_planner_test 

\i schema.sql