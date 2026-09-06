import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Padilla antes del agua",
  description:
    "Explora una recreación de la escuela Miguel Hidalgo de Viejo Padilla, Tamaulipas, hacia 1950, con imágenes y fuentes históricas."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#11100d"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
