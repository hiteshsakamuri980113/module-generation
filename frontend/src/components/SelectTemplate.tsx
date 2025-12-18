import React, { useEffect, useState } from "react";
import TemplateCard from "./TemplateCard";
import type { Template } from "../types/module";

interface SelectTemplateProps {
  onTemplateSelect: (templateId: string) => void;
  onSaveAndContinue: () => void;
  onProjectTitleChange: (title: string) => void;
  selectedTemplate?: string;
  projectTitle?: string;
  isGenerating?: boolean;
}

export default function SelectTemplate({
  onTemplateSelect,
  onSaveAndContinue,
  onProjectTitleChange,
  selectedTemplate,
  projectTitle,
  isGenerating = false,
}: SelectTemplateProps) {
  const [localSelected, setLocalSelected] = useState<string | undefined>(
    selectedTemplate
  );

  // Static templates with IDs 1, 2, 3 as specified
  const templates: Template[] = [
    {
      id: "1",
      name: "Template 1",
      description: "Modern educational module design",
    },
    {
      id: "2",
      name: "Template 2",
      description: "Clean and professional layout",
    },
    {
      id: "3",
      name: "Template 3",
      description: "Interactive and engaging design",
    },
  ];

  useEffect(() => {
    setLocalSelected(selectedTemplate);
  }, [selectedTemplate]);

  function handleSelect(id: string) {
    console.log("Template selected:", id);
    setLocalSelected(id);
    onTemplateSelect(id);
    console.log("Local selected after update:", id);
  }

  function handleSave() {
    if (localSelected) {
      onTemplateSelect(localSelected); // Update the selected template
      onSaveAndContinue(); // Trigger navigation to next step
    }
  }

  return (
    <div className="w-full h-full bg-white text-slate-900 p-6">
      <div className="h-full flex flex-col">
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute top-5 left-1/4 right-1/4 h-px bg-gray-200"></div>

            <div className="flex justify-between">
              {/* Step 1 - Active */}
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border border-primary bg-white flex items-center justify-center text-primary font-semibold text-sm">
                  1
                </div>
                <span className="mt-3 font-inter font-medium text-[14px] leading-[14px] tracking-[0%] text-center text-primary">
                  Select Template
                </span>
              </div>

              {/* Step 2 - Inactive */}
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-400 font-semibold text-sm">
                  2
                </div>
                <span className="mt-3 font-inter font-medium text-[14px] leading-[14px] tracking-[0%] text-center text-gray-400">
                  Upload Documents
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Title Section */}
        <div className="mb-6">
          <div>
            <label className="block font-inter font-medium text-[14px] leading-[20px] tracking-[0%] text-black mb-2">
              Module Title
            </label>
            <input
              value={projectTitle || ""}
              onChange={(e) => onProjectTitleChange(e.target.value)}
              placeholder="Enter your project name"
              className="w-full h-[40px] pt-[8px] pr-[56px] pb-[8px] pl-[12px] rounded-[6px] border border-border bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Template Selection */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-inter font-medium text-[14px] leading-[20px] tracking-[0%] text-black mb-6">
            Select Your Template
          </h3>

          <div className="w-full h-[160px] grid grid-cols-3 gap-[24px] mb-8">
            {templates.map((template: Template) => (
              <TemplateCard
                key={template.id}
                id={template.id}
                title={template.name}
                selected={localSelected === template.id}
                onSelect={() => handleSelect(template.id)}
              />
            ))}
          </div>
        </div>

        {/* Action Button - Fixed at bottom */}
        <div className="flex justify-center pt-6 mt-4">
          <button
            onClick={handleSave}
            disabled={!localSelected || isGenerating}
            className={`h-[40px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] rounded-[6px] font-inter font-medium text-[14px] leading-[24px] tracking-[0%] focus:outline-none transition-colors ${
              !localSelected || isGenerating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
            }`}
          >
            {isGenerating ? "Generating…" : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
