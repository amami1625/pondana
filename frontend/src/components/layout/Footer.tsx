import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p data-testid="copyRight" className="text-sm text-gray-600">
            &copy; 2026 ぽんダナ
          </p>
          <nav>
            <ul className="flex gap-6 text-sm">
              <li>
                <Link href="/terms" className="text-gray-600 transition-colors hover:text-gray-900">
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
