export default function Loading() {
  return (
    <div>
      <section className="flex flex-col gap-15 animate-pulse">
        <div className="flex flex-row items-center justify-between mb-6">
          <div className="bg-gray-200 h-12 w-32 rounded" />
          <div className="bg-gray-200 h-10 w-48 rounded" />
        </div>
        <div className="flex mt-5 flex-row gap-5 items-center">
          <div className="bg-gray-200 w-150 h-80 rounded-md" />
          <div className="flex max-w-[60%] flex-col gap-5">
            <div className="bg-gray-200 h-8 w-32 rounded-4xl" />
            <div className="bg-gray-200 h-10 w-64 rounded" />
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-3">
                <div className="bg-gray-200 h-6 w-40 rounded" />
                <div className="bg-gray-200 h-6 w-32 rounded" />
                <div className="bg-gray-200 h-6 w-24 rounded" />
                <div className="bg-gray-200 h-8 w-24 rounded-4xl mt-2" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-gray-200 h-8 w-48 rounded mb-2" />
          <div className="bg-gray-200 h-20 w-full rounded" />
        </div>
        <div>
          <div className="bg-gray-200 h-8 w-48 rounded mb-2" />
          <div className="grid grid-cols-5 gap-5 mt-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="bg-gray-200 w-100 h-40 rounded-md" />
                <div className="bg-gray-200 h-6 w-32 rounded" />
                <div className="bg-gray-200 h-4 w-24 rounded" />
                <div className="bg-gray-200 h-4 w-20 rounded" />
                <div className="bg-gray-200 h-8 w-full rounded-4xl mt-2" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-gray-200 h-8 w-48 rounded mb-2" />
          <div className="grid grid-cols-4 gap-5 mt-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="bg-gray-200 w-100 h-50 rounded-md" />
                <div className="bg-gray-200 h-6 w-32 rounded mt-4" />
                <div className="bg-gray-200 h-4 w-24 rounded mt-4" />
                <div className="bg-gray-200 h-4 w-20 rounded mt-2" />
                <div className="bg-gray-200 h-8 w-24 rounded-4xl mt-3" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 bg-primary py-3 flex justify-center">
          <div className="bg-gray-200 h-6 w-1/4 rounded" />
        </div>
      </section>
    </div>
  );
} 