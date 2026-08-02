-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO');

-- CreateEnum
CREATE TYPE "TeamGroup" AS ENUM ('BOARD', 'REVISION');

-- CreateTable
CREATE TABLE "About" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "paragraph1" TEXT NOT NULL,
    "paragraph2" TEXT NOT NULL,
    "paragraph3" TEXT NOT NULL,
    "card1Title" TEXT NOT NULL,
    "card1Description" TEXT NOT NULL,
    "card2Title" TEXT NOT NULL,
    "card2Description" TEXT NOT NULL,
    "card3Title" TEXT NOT NULL,
    "card3Description" TEXT NOT NULL,
    "card4Title" TEXT NOT NULL,
    "card4Description" TEXT NOT NULL,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "tagColor" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "showCta" BOOLEAN NOT NULL DEFAULT false,
    "ctaLabel" TEXT NOT NULL,
    "details" TEXT[],
    "people" TEXT[],
    "partners" TEXT[],
    "imageMediaId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Areas" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "header1" TEXT NOT NULL,
    "paragraph1" TEXT NOT NULL,
    "header2" TEXT NOT NULL,
    "paragraph2" TEXT NOT NULL,
    "header3" TEXT NOT NULL,
    "paragraph3" TEXT NOT NULL,
    "header4" TEXT NOT NULL,
    "paragraph4" TEXT NOT NULL,
    "header5" TEXT NOT NULL,
    "paragraph5" TEXT NOT NULL,

    CONSTRAINT "Areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hero" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "header1" TEXT NOT NULL,
    "header2" TEXT NOT NULL,
    "header3" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageMediaId" UUID,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" UUID NOT NULL,
    "type" "MediaType" NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "group" "TeamGroup" NOT NULL,
    "imageMediaId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_key_key" ON "Media"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_imageMediaId_fkey" FOREIGN KEY ("imageMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_imageMediaId_fkey" FOREIGN KEY ("imageMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_imageMediaId_fkey" FOREIGN KEY ("imageMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
