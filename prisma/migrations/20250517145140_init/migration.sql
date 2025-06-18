-- CreateEnum
CREATE TYPE "Pol" AS ENUM ('MUSKO', 'ZENSKO');

-- CreateEnum
CREATE TYPE "Dan" AS ENUM ('PONEDELJAK', 'UTORAK', 'SREDA', 'CETVRTAK', 'PETAK');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ucenik" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "email" TEXT,
    "telefon" TEXT,
    "adresa" TEXT NOT NULL,
    "img" TEXT,
    "pol" "Pol" NOT NULL,
    "pocetak" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roditeljId" TEXT NOT NULL,
    "razredId" INTEGER NOT NULL,
    "oceneId" INTEGER NOT NULL,

    CONSTRAINT "Ucenik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profesor" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "email" TEXT,
    "telefon" TEXT,
    "adresa" TEXT NOT NULL,
    "img" TEXT,
    "pol" "Pol" NOT NULL,
    "pocetak" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profesor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roditelj" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "email" TEXT,
    "telefon" TEXT,
    "adresa" TEXT NOT NULL,
    "pocetak" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roditelj_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ocene" (
    "id" SERIAL NOT NULL,
    "nivo" INTEGER NOT NULL,

    CONSTRAINT "Ocene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Razred" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "brUcenika" INTEGER NOT NULL,
    "razredniId" TEXT,
    "oceneId" INTEGER NOT NULL,

    CONSTRAINT "Razred_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Predmet" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,

    CONSTRAINT "Predmet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lekcija" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "dan" "Dan" NOT NULL,
    "pocetak" TIMESTAMP(3) NOT NULL,
    "kraj" TIMESTAMP(3) NOT NULL,
    "predmetId" INTEGER NOT NULL,
    "razredId" INTEGER NOT NULL,
    "profesorId" TEXT NOT NULL,

    CONSTRAINT "Lekcija_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ispit" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "pocetak" TIMESTAMP(3) NOT NULL,
    "kraj" TIMESTAMP(3) NOT NULL,
    "lekcijaId" INTEGER NOT NULL,

    CONSTRAINT "Ispit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zadatak" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "pocetak" TIMESTAMP(3) NOT NULL,
    "kraj" TIMESTAMP(3) NOT NULL,
    "lekcijaId" INTEGER NOT NULL,

    CONSTRAINT "Zadatak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rezultat" (
    "id" SERIAL NOT NULL,
    "rezultat" INTEGER NOT NULL,
    "ispitId" INTEGER,
    "zadatakId" INTEGER,
    "ucenikId" TEXT NOT NULL,

    CONSTRAINT "Rezultat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prisustvo" (
    "id" SERIAL NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL,
    "prisutan" BOOLEAN NOT NULL,
    "ucenikId" TEXT NOT NULL,
    "lekcijaId" INTEGER NOT NULL,

    CONSTRAINT "Prisustvo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dogadjaj" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "pocetak" TIMESTAMP(3) NOT NULL,
    "kraj" TIMESTAMP(3) NOT NULL,
    "razredId" INTEGER,

    CONSTRAINT "Dogadjaj_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Novosti" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL,
    "razredId" INTEGER NOT NULL,

    CONSTRAINT "Novosti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PredmetToProfesor" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PredmetToProfesor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Ucenik_username_key" ON "Ucenik"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Ucenik_email_key" ON "Ucenik"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ucenik_telefon_key" ON "Ucenik"("telefon");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_username_key" ON "Profesor"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_email_key" ON "Profesor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_telefon_key" ON "Profesor"("telefon");

-- CreateIndex
CREATE UNIQUE INDEX "Roditelj_username_key" ON "Roditelj"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Roditelj_email_key" ON "Roditelj"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Roditelj_telefon_key" ON "Roditelj"("telefon");

-- CreateIndex
CREATE UNIQUE INDEX "Ocene_nivo_key" ON "Ocene"("nivo");

-- CreateIndex
CREATE UNIQUE INDEX "Razred_ime_key" ON "Razred"("ime");

-- CreateIndex
CREATE UNIQUE INDEX "Predmet_ime_key" ON "Predmet"("ime");

-- CreateIndex
CREATE INDEX "_PredmetToProfesor_B_index" ON "_PredmetToProfesor"("B");

-- AddForeignKey
ALTER TABLE "Ucenik" ADD CONSTRAINT "Ucenik_roditeljId_fkey" FOREIGN KEY ("roditeljId") REFERENCES "Roditelj"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ucenik" ADD CONSTRAINT "Ucenik_razredId_fkey" FOREIGN KEY ("razredId") REFERENCES "Razred"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ucenik" ADD CONSTRAINT "Ucenik_oceneId_fkey" FOREIGN KEY ("oceneId") REFERENCES "Ocene"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Razred" ADD CONSTRAINT "Razred_razredniId_fkey" FOREIGN KEY ("razredniId") REFERENCES "Profesor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Razred" ADD CONSTRAINT "Razred_oceneId_fkey" FOREIGN KEY ("oceneId") REFERENCES "Ocene"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lekcija" ADD CONSTRAINT "Lekcija_predmetId_fkey" FOREIGN KEY ("predmetId") REFERENCES "Predmet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lekcija" ADD CONSTRAINT "Lekcija_razredId_fkey" FOREIGN KEY ("razredId") REFERENCES "Razred"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lekcija" ADD CONSTRAINT "Lekcija_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Profesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ispit" ADD CONSTRAINT "Ispit_lekcijaId_fkey" FOREIGN KEY ("lekcijaId") REFERENCES "Lekcija"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zadatak" ADD CONSTRAINT "Zadatak_lekcijaId_fkey" FOREIGN KEY ("lekcijaId") REFERENCES "Lekcija"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rezultat" ADD CONSTRAINT "Rezultat_ispitId_fkey" FOREIGN KEY ("ispitId") REFERENCES "Ispit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rezultat" ADD CONSTRAINT "Rezultat_zadatakId_fkey" FOREIGN KEY ("zadatakId") REFERENCES "Zadatak"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rezultat" ADD CONSTRAINT "Rezultat_ucenikId_fkey" FOREIGN KEY ("ucenikId") REFERENCES "Ucenik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prisustvo" ADD CONSTRAINT "Prisustvo_ucenikId_fkey" FOREIGN KEY ("ucenikId") REFERENCES "Ucenik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prisustvo" ADD CONSTRAINT "Prisustvo_lekcijaId_fkey" FOREIGN KEY ("lekcijaId") REFERENCES "Lekcija"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dogadjaj" ADD CONSTRAINT "Dogadjaj_razredId_fkey" FOREIGN KEY ("razredId") REFERENCES "Razred"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Novosti" ADD CONSTRAINT "Novosti_razredId_fkey" FOREIGN KEY ("razredId") REFERENCES "Razred"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PredmetToProfesor" ADD CONSTRAINT "_PredmetToProfesor_A_fkey" FOREIGN KEY ("A") REFERENCES "Predmet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PredmetToProfesor" ADD CONSTRAINT "_PredmetToProfesor_B_fkey" FOREIGN KEY ("B") REFERENCES "Profesor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
