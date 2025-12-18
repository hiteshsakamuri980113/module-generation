import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DownloadModuleProps {
  onDownload: () => void;
  onGoBack?: () => void;
  isReady?: boolean;
}

const DownloadModule = ({
  onDownload,
  onGoBack,
  isReady = true,
}: DownloadModuleProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (onGoBack) return onGoBack();
    navigate("/");
  };
  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="font-inter font-semibold text-[30px] leading-[36px] tracking-[-0.75%] text-center text-black">
          Module Creation Success
        </h1>
        <p className="font-inter font-normal text-[14px] leading-[24px] tracking-[0%] text-center text-accent">
          Your download will begin shortly or you can click the button below.
        </p>
      </div>

      {/* Download Button */}
      <button
        onClick={onDownload}
        disabled={!isReady}
        className="w-[281px] h-[64px] pt-[16px] pr-[21px] pb-[16px] pl-[21px] gap-[8px] rounded-[6px] bg-indigo-700 hover:bg-indigo-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        <Download className="w-6 h-6 text-white" />
        <span className="font-inter font-medium text-[16px] leading-[24px] tracking-[0%] text-white ml-2">
          Download Module
        </span>
      </button>

      {/* Go to Home Button */}
      <button
        onClick={handleGoHome}
        className="w-[281px] h-[48px] rounded-[6px] bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none transition-colors flex items-center justify-center"
      >
        <span className="font-inter font-medium text-[14px] leading-[20px] tracking-[0%] text-indigo-700">
          Go to Home
        </span>
      </button>
    </div>
  );
};

export default DownloadModule;
