interface UmkmCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  category: string;
  hargaTermurah: number;
  jumlahProduk: number;
  onNavigate: (id: string) => void;
}

export default function UmkmCard({
  name,
  description,
  image,
  address,
  category,
  hargaTermurah,
  jumlahProduk,
  id,
  onNavigate,
}: UmkmCardProps) {
  return (
    <div className="mt-5 flex w-full flex-col gap-2 mb-3 md:mb-0 bg-white rounded-md">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-60 object-cover rounded-md" />
        <div className="absolute top-3 left-3 justify-center bg-primary w-fit px-4 text-white border border-primary text-sm py-1 rounded-full">
          <p>{category}</p>
        </div>
      </div>
      <h1 className="font-bold text-lg line-clamp-1">{name}</h1>
      <p className="line-clamp-2 text-sm">{description}</p>
      <div>
        <div className="my-4">
          <div className="flex flex-row gap-2 items-center">
            <img src="/icons/location.svg" alt="location" className="w-4 h-4" />
            <p className="text-sm line-clamp-1">{address}</p>
          </div>
          <div className="flex flex-row gap-2 mt-3 items-center">
            <img src="/icons/product.svg" alt="product" className="w-4 h-4" />
            <p className="text-sm">{jumlahProduk} Produk</p>
          </div>
        </div>
        <div className="mt-5 flex flex-row items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="text-sm">Mulai dari</p>
            <p className="text-lg font-bold">Rp {hargaTermurah}</p>
          </div>
          <div
            onClick={() => onNavigate(id)}
            className="cursor-pointer hover:bg-primary/80 transition-all flex px-5 py-1 font-normal text-white rounded-full justify-center bg-primary items-center w-fit"
          >
            <p>Lihat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
