-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'penumpang');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'penumpang',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pelanggan" (
    "id" SERIAL NOT NULL,
    "NIK" VARCHAR(100) NOT NULL,
    "nama_penumpang" VARCHAR(100) NOT NULL,
    "alamat" TEXT,
    "telp" VARCHAR(20),
    "id_user" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pelanggan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Petugas" (
    "id" SERIAL NOT NULL,
    "nama_petugas" VARCHAR(100) NOT NULL,
    "alamat" TEXT,
    "telp" VARCHAR(20),
    "id_user" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Petugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kereta" (
    "id" SERIAL NOT NULL,
    "nama_kereta" VARCHAR(100) NOT NULL,
    "deskripsi" TEXT,
    "kelas" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kereta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gerbong" (
    "id" SERIAL NOT NULL,
    "nama_gerbong" TEXT NOT NULL,
    "kuota" INTEGER NOT NULL,
    "id_kereta" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gerbong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kursi" (
    "id" SERIAL NOT NULL,
    "no_kursi" TEXT NOT NULL,
    "id_gerbong" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kursi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jadwal" (
    "id" SERIAL NOT NULL,
    "asal_keberangkatan" VARCHAR(100) NOT NULL,
    "tujuan_keberangkatan" VARCHAR(100) NOT NULL,
    "tanggal_berangkat" TIMESTAMP(3) NOT NULL,
    "tanggal_kedatangan" TIMESTAMP(3) NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "id_kereta" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jadwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PembelianTiket" (
    "id" SERIAL NOT NULL,
    "tanggal_pembelian" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_pelanggan" INTEGER NOT NULL,
    "id_jadwal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PembelianTiket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPembelian" (
    "id" SERIAL NOT NULL,
    "NIK" VARCHAR(100) NOT NULL,
    "nama_penumpang" VARCHAR(100) NOT NULL,
    "id_pembelian_tiket" INTEGER NOT NULL,
    "id_kursi" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailPembelian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Pelanggan_NIK_key" ON "Pelanggan"("NIK");

-- CreateIndex
CREATE UNIQUE INDEX "Pelanggan_id_user_key" ON "Pelanggan"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "Petugas_id_user_key" ON "Petugas"("id_user");

-- AddForeignKey
ALTER TABLE "Pelanggan" ADD CONSTRAINT "Pelanggan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Petugas" ADD CONSTRAINT "Petugas_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gerbong" ADD CONSTRAINT "Gerbong_id_kereta_fkey" FOREIGN KEY ("id_kereta") REFERENCES "Kereta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kursi" ADD CONSTRAINT "Kursi_id_gerbong_fkey" FOREIGN KEY ("id_gerbong") REFERENCES "Gerbong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jadwal" ADD CONSTRAINT "Jadwal_id_kereta_fkey" FOREIGN KEY ("id_kereta") REFERENCES "Kereta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembelianTiket" ADD CONSTRAINT "PembelianTiket_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "Pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembelianTiket" ADD CONSTRAINT "PembelianTiket_id_jadwal_fkey" FOREIGN KEY ("id_jadwal") REFERENCES "Jadwal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPembelian" ADD CONSTRAINT "DetailPembelian_id_pembelian_tiket_fkey" FOREIGN KEY ("id_pembelian_tiket") REFERENCES "PembelianTiket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPembelian" ADD CONSTRAINT "DetailPembelian_id_kursi_fkey" FOREIGN KEY ("id_kursi") REFERENCES "Kursi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
