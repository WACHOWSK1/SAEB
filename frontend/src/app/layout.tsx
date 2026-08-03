import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { institutionalTheme } from '../config/theme';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SAEB 2023 — Plataforma de Inteligência Educacional (9º Ano EF)',
  description: 'Análise diagnóstica oficial dos microdados do SAEB 2023 para o 9º Ano do Ensino Fundamental',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#F5F5F5] font-sans antialiased text-[#202124] min-h-screen" suppressHydrationWarning>
        <ConfigProvider theme={institutionalTheme} locale={ptBR}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
