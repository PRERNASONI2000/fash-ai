import { Link } from 'react-router-dom'

const footerLink =
  'text-sm text-zinc-600 transition hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400'

export function Footer() {
  return (
    <footer className="shrink-0 border-t border-zinc-200/80 bg-white/60 px-4 py-4 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60 sm:px-6">
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} VeoGen. All rights reserved.
        </p>
        {/* <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="Footer">
          <Link to="/generate" className={footerLink}>
            Generator
          </Link>
          <Link to="/" className={footerLink}>
            Home
          </Link>
          <a href="#" className={footerLink}>
            Privacy
          </a>
          <a href="#" className={footerLink}>
            Terms
          </a>
        </nav> */}
      </div>
    </footer>
  )
}
