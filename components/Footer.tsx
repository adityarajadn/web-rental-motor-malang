import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border-color mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-heading font-bold text-gradient tracking-tight">
              MotoRent Malang
            </span>
            <p className="mt-4 text-text-muted max-w-md">
              Solusi rental motor terpercaya di Malang. Menyediakan berbagai
              pilihan motor berkualitas dengan proses booking yang cepat, aman,
              dan transparan.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-main tracking-wider uppercase mb-4">
              Layanan
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/fleet"
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Daftar Motor
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-main tracking-wider uppercase mb-4">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="text-text-muted">📍 Jl. Mawar I/3, Malang</li>
              <li className="text-text-muted">📞 +62 855-3695-2006</li>
              <li className="text-text-muted">✉️ info@motorentmalang.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border-color pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} MotoRent Malang. Hak Cipta
            Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
