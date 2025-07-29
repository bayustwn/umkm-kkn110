export function formatDate(tanggal: string): string {
    const date = new Date(tanggal);
  
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }