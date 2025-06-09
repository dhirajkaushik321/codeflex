'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: unknown) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
} 