import React, { useState, useRef } from "react";
import { Info, Upload, Link, X, Plus } from "lucide-react";
import { useModule } from "../contexts/ModuleContext";
import type { UploadedFile, MediaItem } from "../types/module";

interface UploadDocumentsProps {
  onGoBackToStep1: () => void;
  uploadedFiles?: UploadedFile[];
  isGenerating?: boolean;
}

const UploadDocuments = ({
  onGoBackToStep1,
  uploadedFiles = [],
  isGenerating = false,
}: UploadDocumentsProps) => {
  const {
    addUploadedFile,
    removeUploadedFile,
    generateModule,
    nextStep,
    setModuleFormData,
  } = useModule();

  // allow parent to pass isGenerating to disable controls during generation

  // State for uploaded content documents
  const [contentFiles, setContentFiles] = useState<File[]>([]);

  // State for structured media items
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { id: "", type: "image", url: "", description: "" },
  ]);

  // State for quiz details
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [numQuestions, setNumQuestions] = useState<string>("5");

  // File input ref
  const contentDocRef = useRef<HTMLInputElement>(null);

  // Handle content file upload
  const handleContentFileUpload = (files: File[]) => {
    setContentFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        category: "content",
      };
      addUploadedFile(uploadedFile);
    });
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleContentFileUpload(files);
  };

  // Handle file selection from input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleContentFileUpload(files);
  };

  // Remove content file
  const removeContentFile = (index: number) => {
    setContentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle media items
  const addMediaItem = () => {
    setMediaItems((prev) => [
      ...prev,
      { id: "", type: "image", url: "", description: "" },
    ]);
  };

  const updateMediaItem = (
    index: number,
    field: keyof MediaItem,
    value: string
  ) => {
    setMediaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeMediaItem = (index: number) => {
    if (mediaItems.length > 1) {
      setMediaItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle generate module
  const handleGenerate = async () => {
    try {
      if (contentFiles.length === 0) {
        alert("Please upload at least one content document");
        return;
      }

      // Prepare quiz details to pass directly to generateModule
      const quizDetails = {
        difficulty: difficulty as "easy" | "medium" | "hard",
        numQuestions: parseInt(numQuestions),
        mediaItems: mediaItems.filter(
          (item) => item.url.trim() && item.id.trim()
        ),
      };

      console.log("Generating module with quiz details:", quizDetails);

      // Pass quiz details directly to generateModule to avoid async state issues
      await generateModule(quizDetails);
      nextStep(); // Go to download page
    } catch (error) {
      console.error("Error generating module:", error);
    }
  };

  return (
    <div className="w-full h-full bg-white text-slate-900 p-6">
      <div className="h-full flex flex-col">
        {/* Header with Steps */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute top-5 left-1/4 right-1/4 h-px bg-gray-200"></div>

            <div className="flex justify-between">
              {/* Step 1 - Completed */}
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border border-green-500 bg-green-500 flex items-center justify-center text-white font-semibold text-sm">
                  ✓
                </div>
                <span className="mt-3 font-inter font-medium text-[14px] leading-[14px] tracking-[0%] text-center text-green-500">
                  Select Template
                </span>
              </div>

              {/* Step 2 - Active */}
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border border-primary bg-white flex items-center justify-center text-primary font-semibold text-sm">
                  2
                </div>
                <span className="mt-3 font-inter font-medium text-[14px] leading-[14px] tracking-[0%] text-center text-primary">
                  Upload Documents
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Section 1: Upload Content Documents */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-inter font-semibold text-[14px] leading-[20px] text-black mb-3 flex items-center">
              <Upload className="h-4 w-4 mr-2 text-indigo-600" />
              Upload Content Documents
            </h3>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer"
              onClick={() => contentDocRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-1 text-sm">
                Drag and drop your content documents here, or{" "}
                <span className="text-indigo-600 underline">browse</span>
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF, DOC, DOCX, TXT files
              </p>
            </div>

            <input
              ref={contentDocRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Display uploaded content files */}
            {contentFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Uploaded Files:</h4>
                <div className="space-y-2">
                  {contentFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <button
                        onClick={() => removeContentFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Media Items */}
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-inter font-semibold text-[14px] leading-[20px] text-black flex items-center">
                <Link className="h-4 w-4 mr-2 text-indigo-600" />
                Media Items (Images/Videos)
              </h3>
              <button
                onClick={addMediaItem}
                className="flex items-center text-indigo-600 hover:text-indigo-700 text-xs font-medium"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Media
              </button>
            </div>

            <div className="text-xs text-gray-600 mb-3 p-2 bg-blue-50 rounded border">
              <strong>How to use:</strong> Add placeholders like{" "}
              <code className="bg-white px-1 rounded">{"{{image:logo}}"}</code>{" "}
              or{" "}
              <code className="bg-white px-1 rounded">{"{{video:intro}}"}</code>{" "}
              in your content documents, then provide matching URLs below with
              the same ID.
            </div>

            <div className="space-y-3">
              {mediaItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded p-3 space-y-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Media ID
                      </label>
                      <input
                        type="text"
                        value={item.id}
                        onChange={(e) =>
                          updateMediaItem(index, "id", e.target.value)
                        }
                        placeholder="e.g., logo, intro, chart1"
                        className="w-full h-[32px] px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={item.type}
                        onChange={(e) =>
                          updateMediaItem(index, "type", e.target.value)
                        }
                        className="w-full h-[32px] px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) =>
                        updateMediaItem(index, "url", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg or https://example.com/video.mp4"
                      className="w-full h-[32px] px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateMediaItem(index, "description", e.target.value)
                      }
                      placeholder="Alt text or description for accessibility"
                      className="w-full h-[32px] px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  {mediaItems.length > 1 && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeMediaItem(index)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Quiz Details */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-inter font-semibold text-[14px] leading-[20px] text-black mb-3 flex items-center">
              <Info className="h-4 w-4 mr-2 text-indigo-600" />
              Quiz Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Difficulty Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full h-[32px] px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Number of Questions Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Number of Questions
                </label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="w-full h-[32px] px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 mt-3 border-t border-gray-200">
          <button
            onClick={onGoBackToStep1}
            className="h-[36px] px-4 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm"
          >
            Back
          </button>

          <button
            onClick={handleGenerate}
            disabled={contentFiles.length === 0 || isGenerating}
            className={`h-[36px] px-4 py-1 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm ${
              contentFiles.length === 0 || isGenerating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isGenerating
              ? "Generating… (this may take a few minutes)"
              : "Generate Module"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;
