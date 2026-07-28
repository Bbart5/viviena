-- CreateTable
CREATE TABLE "About" (
    "id" SERIAL NOT NULL,
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
CREATE TABLE "Areas" (
    "id" SERIAL NOT NULL,
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
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "header1" TEXT NOT NULL,
    "header2" TEXT NOT NULL,
    "header3" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
