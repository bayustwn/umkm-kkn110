interface DateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStart: string;
  dateEnd: string;
  onDateStartChange: (value: string) => void;
  onDateEndChange: (value: string) => void;
  onApply: () => void;
  dateStartRef: React.RefObject<HTMLInputElement | null>;
  dateEndRef: React.RefObject<HTMLInputElement | null>;
  formatDate: (date: string) => string;
}

export default function DateFilterModal({
  isOpen,
  onClose,
  dateStart,
  dateEnd,
  onDateStartChange,
  onDateEndChange,
  onApply,
  dateStartRef,
  dateEndRef,
  formatDate,
}: DateFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 px-6 md:px-6 w-full max-w-xs md:max-w-sm shadow-lg mx-2">
        <h2 className="text-lg font-semibold mb-4">Pilih Rentang Tanggal</h2>
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block mb-2 font-medium">Tanggal Awal</label>
            <button
              type="button"
              className="flex items-center gap-2 border-1 border-primary text-primary bg-secondary rounded-4xl pl-4 pr-4 py-2 w-full outline-none cursor-pointer"
              onClick={() => dateStartRef.current?.showPicker()}
            >
              <img src="/icons/date-blue.svg" alt="date" className="w-4 h-4" />
              <span className={dateStart ? '' : 'text-normal text-primary/80'}>
                {dateStart ? formatDate(dateStart) : 'Pilih tanggal awal'}
              </span>
            </button>
            <input
              type="date"
              ref={dateStartRef}
              className="absolute opacity-0 pointer-events-none w-0 h-0"
              value={dateStart}
              onChange={(e) => onDateStartChange(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Tanggal Akhir</label>
            <button
              type="button"
              className="flex items-center gap-2 border-1 border-primary text-primary bg-secondary rounded-4xl pl-4 pr-4 py-2 w-full outline-none cursor-pointer"
              onClick={() => dateEndRef.current?.showPicker()}
            >
              <img src="/icons/date-blue.svg" alt="date" className="w-4 h-4" />
              <span className={dateEnd ? '' : 'text-primary/80'}>
                {dateEnd ? formatDate(dateEnd) : 'Pilih tanggal akhir'}
              </span>
            </button>
            <input
              type="date"
              ref={dateEndRef}
              className="absolute opacity-0 pointer-events-none w-0 h-0"
              value={dateEnd}
              onChange={(e) => onDateEndChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="cursor-pointer px-4 py-2 rounded-4xl bg-secondary border-1 border-primary text-primary"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="disabled:bg-primary/50 cursor-pointer px-4 py-2 rounded-4xl bg-primary text-white hover:bg-primary/80"
            onClick={onApply}
            disabled={!dateStart || !dateEnd}
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
