import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Manasor premium zeytin ve zeytinyağı ürünlerimizi inceleyin.",
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
