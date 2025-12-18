import type {
  Template,
  ModuleGenerationRequest,
  ModuleGenerationResponse,
} from "../types/module";

const API_BASE_URL = "http://localhost:5174";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Generate module
  async generateModule(
    data: ModuleGenerationRequest & { selectedTemplate?: string }
  ): Promise<ModuleGenerationResponse> {
    const formData = new FormData();

    formData.append("moduleName", data.moduleName);
    formData.append("difficulty", data.difficulty);
    formData.append("numQuestions", data.numQuestions.toString());
    formData.append("mediaItems", JSON.stringify(data.mediaItems));
    formData.append("attachment", data.attachmentFile);

    // Send selected template information
    if (data.selectedTemplate) {
      formData.append("selectedTemplate", data.selectedTemplate);
    }

    // Only append template file if custom template is being used
    if (data.templateFile) {
      formData.append("template", data.templateFile);
    }

    return this.request<ModuleGenerationResponse>("/api/generate", {
      method: "POST",
      body: formData,
    });
  }

  // Download module
  getDownloadUrl(filename: string): string {
    return `${API_BASE_URL}/generated/${filename}/download`;
  }

  // Check if file exists (for validation)
  async checkFileExists(filename: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/generated/${filename}`, {
        method: "HEAD",
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
