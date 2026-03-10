interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({ isLoading, message = 'Memproses...' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg flex flex-col items-center px-8 py-10 shadow-lg">
        <img src="/icons/loading.svg" alt="Loading" className="w-12 h-12 animate-spin mb-4" />
        <span className="text-lg font-semibold text-gray-700">{message}</span>
      </div>
    </div>
  );
}
