import React from "react";
import template1 from "../assets/template_1.png";
import template2 from "../assets/template_2.png";
import template3 from "../assets/template_3.png";

interface TemplateCardProps {
  id: string;
  title: string;
  selected: boolean;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  title,
  selected,
  onSelect,
}) => {
  // Get the appropriate template image
  const getTemplateImage = () => {
    switch (id) {
      case "1":
        return template1;
      case "2":
        return template2;
      case "3":
        return template3;
      default:
        return template1;
    }
  };

  return (
    <button
      onClick={onSelect}
      className={`group relative w-full h-[160px] overflow-hidden rounded-[6px] border transition-all duration-200 focus:outline-none bg-white flex flex-col ${
        selected
          ? "border-indigo-500 shadow-lg"
          : "border-border hover:border-gray-400 hover:shadow-md"
      }`}
    >
      {/* Image Section */}
      <div className="h-[80%] w-full overflow-hidden">
        <img
          src={getTemplateImage()}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Section */}
      <div className="h-[20%] w-full flex items-center justify-between px-3 bg-white">
        <span className="font-inter font-normal text-[14px] leading-[20px] tracking-[0%] text-accent">
          {title}
        </span>
        {selected && (
          <div className="h-4 w-4 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <svg
              className="h-2.5 w-2.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
};

export default TemplateCard;
