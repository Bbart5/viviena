-- Clear dangling references left over from before the constraint existed.
UPDATE "Hero" SET "imageMediaId" = NULL
WHERE "imageMediaId" IS NOT NULL
  AND "imageMediaId" NOT IN (SELECT "id" FROM "Media");

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_imageMediaId_fkey" FOREIGN KEY ("imageMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
