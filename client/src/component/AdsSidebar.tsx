import React from 'react';
import Post from "../assets/POST.webp"
import AVAILABLE from "../assets/AVAILABLE.webp"
import graphicdesigningad from "../assets/graphicdesigningad.webp"

const AdsSidebar: React.FC = () => {
  const ads = [
    {
      // title: "Master Construction in Modern Era",
      image: graphicdesigningad,
      // content: "Learn how to build sustainable cities with our new course."
    },
    {
      // title: "Auditing Software for Firms",
      image: AVAILABLE,
      // content: "Streamline your auditing process today."
      // content: "Streamline your auditing process today."
    },
    {
      // title: "New Assets Available",
      image: Post,
      // content: "Check out the latest 3D models for your projects."
    }
  ];

  return (
    <aside className="w-64 hidden xl:flex flex-col gap-6 sticky top-20 h-fit">
      <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest px-2">Sponsored</h3>
      {ads.map((ad, index) => (
        <div key={index} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#333] hover:border-[#444] transition-colors group cursor-pointer shadow-lg shadow-black/20">
          <div className="relative overflow-hidden w-full h-auto bg-[#0a0a0a]">
            <img 
              src={ad.image} 
              alt="Sponsored Ad"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      ))}
    </aside>
  );
};

export default AdsSidebar;
