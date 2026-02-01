"use client"

import {  useCallback, useState } from "react";
import { LucideDownload } from "lucide-react";

function Dashboard() {
  const [search, setSearch]=useState<string|null>();
  const [data,setData]=useState<Array<object>>([]);
  const [toast, setToast]=useState<boolean>(false);
  const [isHover, setIsHover] = useState<string | null>(null);

    const key=import.meta.env.VITE_UNSPLASH_KEY;
    const url = `https://api.unsplash.com/search/photos?query=${search}&client_id=${key}`;
  const submit=async(e:any)=>{
    e.preventDefault();
     
    try {
      const res = await fetch(url);
      if(!res.ok) throw new Error("Failed to fetch images");

      const data = await res.json();
      setData(data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  {/* Download image */}
  const downloadImage = useCallback( async (url: string, filename: string)=> {
   setToast(true);
    setTimeout(() => { setToast(false); },2000);
    try{
      const response = await fetch(url)
      const blob = await response.blob();

      const link = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = link;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(link);
    } catch (error) {
      console.error("Error downloading image:", error);
  }
  },[]);
 



  
  return (
    <div className="  relative overflow-hidden  ">
      
      <div className="relative w-full  flex flex-col items-center justify-center gap-4 h-screen"
      style={{ backgroundImage: `url('/4e4d3eee-8429-490b-9599-5638d7941bf4.jpg')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', filter: 'brightness(90%)', backgroundPosition: 'center' }}
      >
      
        <div className="p-5 flex-col flex items-center justify-center gap-2 md:lg:gap-6 font-serif">
          <p className="md:lg:text-8xl  font-semibold text-3xl">Stunning Photos,</p>
          <span className=" md:lg:text-8xl text-3xl">completely Free</span>
          <span className="font-sans md:lg:text-3xl text-sm md:lg:mt-8 flex items-center md:lg:w-200 w-100 justify-center items-center">
            <p>Discover Over 1000 premium stock photos download in <span className="flex items-center justify-center md:lg:mt-3"> high resolution. No attribution required</span></p>
          
          </span>
        </div>
      
    {/* Search Bar */}
   <div className="md:lg:w-full flex">
    <form onSubmit={submit} className="w-full flex justify-center">
      <input type="text" placeholder="Search for Photos.." onChange={(e)=>setSearch(e.target.value)} className="border-2 rounded-l-xl border-green-700 p-2 md:lg:py-4 w-auto md:lg:w-200"/>
      <button type="submit" className="border-2 text-black lg:md:text-xl rounded-r-xl border-green-700 p-2 cursor-pointer">Search</button>
    </form> 

   </div>
   <div className="flex justify-center items-center mt-3 md:lg:w-full ">
    <span className="gap-8 flex flex-row font-sans md:lg:text-xl text-sm">Popular:
      <p>Nature</p>
      <p>Sports</p>
      <p>Travel</p>
      <p>Food</p>
    </span>
   </div>
   </div>
   
 {/* Display Images */}
   <div className="bg-green-100" >
    
    <div className=" columns-2 md:lg:columns-4 md:lg:p-5 p-2">
{
data.map((item:any)=>(
  <div  key={item.id} className="relative group break-inside-avoid md:lg:mb-4 mb-2" 
  onMouseEnter={() =>setIsHover(item.id)}
  onMouseLeave={() => setIsHover(null)}>

  <img key={item.id} 
  src={item.urls.small} 
  alt={item.alt_description}
  className="w-full  rounded-xl group-hover:scale-102 transition-transform duration-300"
  loading="lazy"
  />
  
  {isHover===item.id && (
    <div className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-2 cursor-pointer hover:bg-green-600 hover:text-white transition-colors duration-300"
    onClick={()=> downloadImage(item.urls.full, `unsplash-${item.id}.jpg`)}
    >
      <button className="rounded-lg w-20 flex flex-row justify-center items-center cursor-pointer"><LucideDownload className="w-4 h-4 mr-2 "/> <span className="text-lg">Free</span></button>
    </div>
  )}

 {toast && (
  <div className="fixed top-5 left-10 bg-green-600 text-white px-4 py-2 rounded-lg md:lg:text-xl text-sm border-1 border-white z-50">
    Image downloaded successfully!
  </div>
)}
  
  
  </div>
))
}

</div>

   </div>
    </div>

    
    
  );
}

export default Dashboard;
