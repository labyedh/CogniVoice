import React from 'react';
import { Image } from 'lucide-react';

interface ImagePromptProps {
  imageUrl: string;
  alt: string;
  description: string;
}

const ImagePrompt: React.FC<ImagePromptProps> = ({ imageUrl, alt, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#FFEAD8]">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={alt}
          className="w-full h-85 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Image className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Describe What You See
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-[#FFEAD8] to-[#E8988A]/20 rounded-lg border-l-4 border-[#9B177E]">
          <p className="text-sm text-[#2A1458]">
            <strong>Instructions:</strong> Please describe this image in detail, 
            including what you see, the activities taking place, and any emotions 
            or stories the image might convey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImagePrompt;