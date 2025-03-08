'use client';
import React from "react";
import Image from "next/image";


const ProductCard1 =()=>{
return(
 <div className="min-h-[15vh] w-[20%] bg-blue-500/10 flex flex-col gap-1">
    <h1>sample image</h1>
    <h2>sample title</h2>
    <span>sample Price</span>
    <span>shop name</span>
    <span>rating</span>
    <button>Add to cart</button>
     
</div>
)
}


export default ProductCard1;

