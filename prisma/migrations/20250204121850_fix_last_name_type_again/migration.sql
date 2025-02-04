/*
  Warnings:

  - Made the column `last_name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL;
