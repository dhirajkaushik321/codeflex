import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar />
        {children}
      </div>
    </ThemeProvider>
  );
} 