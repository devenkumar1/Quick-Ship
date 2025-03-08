import Image from "next/image";
import Navbar from "@/components/Navbar";
import CategoriesDiv from "@/components/CategoriesDiv";
import ProductCard1 from "@/components/ProductCard1";
export default function Home() {
  return (
 <div className="w-full min-h-screen flex flex-col gap-2">
  <Navbar/>
  <CategoriesDiv/>
        <h2>food and others...</h2> 
  <div className="min-w-full overflow-x-auto flex flex-row gap-2">
        {/* Product cards */}
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
        <ProductCard1 />
      </div>
  <h1>
   hi
  </h1>
 </div>
  );
}
