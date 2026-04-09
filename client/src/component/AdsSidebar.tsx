import React from 'react';

const AdsSidebar: React.FC = () => {
  const ads = [
    {
      title: "Master Construction in Modern Era",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&q=80",
      content: "Learn how to build sustainable cities with our new course."
    },
    {
      title: "Auditing Software for Firms",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
      content: "Streamline your auditing process today."
    },
    {
      title: "New Assets Available",
      image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=500&q=80",
      content: "Check out the latest 3D models for your projects."
    }
  ];

  return (
    <aside className="w-80 hidden xl:flex flex-col gap-6 sticky top-20 h-fit">
      <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest px-2">Sponsored</h3>
      {ads.map((ad, index) => (
        <div key={index} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#333] hover:border-[#444] transition-colors group cursor-pointer">
          <div className="relative overflow-hidden aspect-video">
            <img 
              src={ad.image} 
              alt={ad.title} 
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="p-4">
            <h4 className="font-bold text-sm mb-1">{ad.title}</h4>
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{ad.content}</p>
          </div>
        </div>
      ))}
    </aside>
  );
};

export default AdsSidebar;
