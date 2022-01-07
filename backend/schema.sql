CREATE TABLE "users" ( 
  "id" INT PRIMARY KEY NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL, 
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "needs_new_pwd" BOOLEAN NOT NULL DEFAULT TRUE,
  "is_admin" BOOLEAN NOT NULL DEFAULT FALSE,
  "is_dept_head" BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE "departments" ( 
  "code" text PRIMARY KEY,
  "name" text NOT NULL, 
  "dept_head" int
);


CREATE TABLE "dept_volunteers" (
  "dept_code" text, 
  "user_id" int, 
  PRIMARY KEY ("dept_code", "user_id")
);


CREATE TABLE "events" (
  "id" INT PRIMARY KEY NOT NULL,
  "date" date NOT NULL,
  "dept_code" text NOT NULL
);


CREATE TABLE "positions" ( 
  "code" text PRIMARY KEY,
  "name" text NOT NULL,
  "dept_code" text NOT NULL
);


CREATE TABLE "events_volunteers" (
  "user_id" int, 
  "event_id" int, 
  "position_code" text NOT NULL,
  PRIMARY KEY ("user_id", "event_id")
);


CREATE TABLE "unavailable" (
  "id" INT PRIMARY KEY NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "user_id" INT NOT NULL
);


CREATE TABLE "user_position" (
  "user_id" int,
  "position_code" text, 
  PRIMARY KEY ("user_id", "position_code")
);


ALTER TABLE "departments" ADD
FOREIGN KEY ("dept_head") REFERENCES "users" ("id") ON
DELETE CASCADE;


ALTER TABLE "dept_volunteers" ADD
FOREIGN KEY ("dept_code") REFERENCES "departments" ("code") ON
DELETE CASCADE;


ALTER TABLE "dept_volunteers" ADD
FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON
DELETE CASCADE;


ALTER TABLE "positions" ADD
FOREIGN KEY ("dept_code") REFERENCES "departments" ("code") ON
DELETE CASCADE;


ALTER TABLE "events" ADD
FOREIGN KEY ("dept_code") REFERENCES "departments" ("code") ON
DELETE CASCADE;


ALTER TABLE "events_volunteers" ADD
FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON
DELETE CASCADE;


ALTER TABLE "events_volunteers" ADD
FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON
DELETE CASCADE;


ALTER TABLE "events_volunteers" ADD
FOREIGN KEY ("position_code") REFERENCES "positions" ("code") ON
DELETE CASCADE;


ALTER TABLE "unavailable" ADD
FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON
DELETE CASCADE;


ALTER TABLE "user_position" ADD
FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON
DELETE CASCADE;


ALTER TABLE "user_position" ADD
FOREIGN KEY ("position_code") REFERENCES "positions" ("code") ON
DELETE CASCADE;

ALTER TABLE "users" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY;
ALTER TABLE "unavailable" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY;
ALTER TABLE "events" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY;