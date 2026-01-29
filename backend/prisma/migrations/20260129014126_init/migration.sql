-- CreateTable
CREATE TABLE "Standard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Standard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Structure" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "standardId" INTEGER NOT NULL,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StructureMaterial" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "structureId" INTEGER NOT NULL,

    CONSTRAINT "StructureMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Standard_name_key" ON "Standard"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Structure_name_standardId_key" ON "Structure"("name", "standardId");

-- AddForeignKey
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StructureMaterial" ADD CONSTRAINT "StructureMaterial_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
