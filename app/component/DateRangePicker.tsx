import React, { useState, useRef, useEffect } from "react";
import { formatDate } from "../utils/date";

interface DateRangePickerProps {
    open: boolean;
    onClose: () => void;
    onApply: (startDate: string, endDate: string) => void;
    initialStartDate?: string;
    initialEndDate?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ open, onClose, onApply, initialStartDate = "", initialEndDate = "" }) => {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const startInputRef = useRef<HTMLInputElement | null>(null);
    const endInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setStartDate(initialStartDate || "");
        setEndDate(initialEndDate || "");
    }, [initialStartDate, initialEndDate]);

    if (!open) return null;

    let isInvalid = false;
    if (startDate && endDate) {
        isInvalid = new Date(startDate) > new Date(endDate);
    }

    const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
        if (ref.current) {
            if (typeof ref.current.showPicker === 'function') {
                ref.current.showPicker();
            } else {
                ref.current.focus();
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Pilih Rentang Tanggal</h2>
                <div className="flex flex-col gap-4 mb-6">
                    <div>
                        <label className="block mb-2 font-medium">Tanggal Awal</label>
                        <button
                            type="button"
                            className="flex items-center gap-2 border-1 border-primary text-primary bg-secondary rounded-4xl pl-4 pr-4 py-2 w-full outline-none cursor-pointer"
                            onClick={() => openDatePicker(startInputRef)}
                        >
                            <img src="/icons/date.svg" alt="date" className="w-3 h-3" />
                            <span className={startDate ? "" : "text-normal text-primary/80"}>
                                {startDate ? formatDate(startDate) : "Pilih tanggal awal"}
                            </span>
                        </button>
                        <input
                            type="date"
                            ref={startInputRef}
                            className="absolute opacity-0 pointer-events-none w-0 h-0"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Tanggal Akhir</label>
                        <button
                            type="button"
                            className="flex items-center gap-2 border-1 border-primary text-primary bg-secondary rounded-4xl pl-4 pr-4 py-2 w-full outline-none cursor-pointer"
                            onClick={() => openDatePicker(endInputRef)}
                        >
                            <img src="/icons/date.svg" alt="date" className="w-3 h-3" />
                            <span className={endDate ? "" : "text-primary/80"}>
                                {endDate ? formatDate(endDate) : "Pilih tanggal akhir"}
                            </span>
                        </button>
                        <input
                            type="date"
                            ref={endInputRef}
                            className="absolute opacity-0 pointer-events-none w-0 h-0"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                        {isInvalid && (
                            <div className="mt-5 text-sm text-red-600">Tanggal akhir harus setelah tanggal awal</div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 rounded-4xl bg-secondary border-1 border-primary text-primary" onClick={onClose}>Batal</button>
                    <button className="disabled:bg-primary/50 px-4 py-2 rounded-4xl bg-primary text-white hover:bg-primary/80" onClick={() => onApply(startDate, endDate)} disabled={!startDate || !endDate || isInvalid}>Terapkan</button>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker; 