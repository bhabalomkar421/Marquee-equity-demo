-- queries
CREATE DATABASE Company;

CREATE TABLE "companies" ("cin" VARCHAR(100) NOT NULL, "companyName" VARCHAR(500) NOT NULL, PRIMARY KEY ("cin"));

INSERT INTO companies("cin", "companyName") VALUES ('12345', 'temp');
