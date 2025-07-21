export default function Footer() {
  return (
    <div className="mt-30 flex gap-40 flex-row items-start">
      <div className="flex flex-col max-w-90 items-start">
        <img src="/logo/logo.svg" alt="logo" />
        <p className="mt-5">
          Lorem Ipsum is simply dummy text of the printing pesetting industry.
          Lorem Ipsum has been.{" "}
        </p>
      </div>
      <div className="flex flex-col gap-2 font-medium">
        <h1 className="text-primary text-lg font-bold">Informasi</h1>
        <p className="cursor-pointer hover:text-primary">Tentang</p>
        <p className="cursor-pointer hover:text-primary">Semua UMKM</p>
        <p className="cursor-pointer hover:text-primary">Semua Berita</p>
      </div>
      <div className="flex flex-col gap-2 font-medium">
        <h1 className="text-primary text-lg font-bold">Kontak</h1>
        <p className="cursor-pointer hover:text-primary">Email</p>
        <p className="cursor-pointer hover:text-primary">Whatsapp</p>
        <p className="cursor-pointer hover:text-primary">Instagram</p>
      </div>
    </div>
  );
}
