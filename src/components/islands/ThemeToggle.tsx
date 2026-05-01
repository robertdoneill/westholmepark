import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

interface Props {
  variant?: 'default' | 'hero';
}

export function ThemeToggle({ variant = 'default' }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const buttonClass =
    variant === 'hero'
      ? 'inline-flex h-9 w-9 items-center justify-center border border-white/30 bg-black/25 text-white backdrop-blur transition-colors hover:bg-black/40'
      : 'inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted transition-colors';

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', next);
  };

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={buttonClass}
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={buttonClass}
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
