import { GoogleGenAI } from "@google/genai";
import { ImageSize, VideoAspectRatio } from "../types";

// Helper to get a fresh AI instance with the currently selected key
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please select a key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const checkApiKeySelection = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const openApiKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  }
};

export const generateLogoImage = async (
  prompt: string,
  size: ImageSize
): Promise<{ base64: string; mimeType: string }> => {
  const ai = getAI();
  
  // Using the high-quality image preview model as requested
  const modelId = "gemini-3-pro-image-preview";
  
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1", // Logos are typically square
        }
      }
    });

    // Extract image data
    let imagePart = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imagePart = part.inlineData;
          break;
        }
      }
    }

    if (!imagePart || !imagePart.data) {
      throw new Error("No image data received from the model.");
    }

    return {
      base64: imagePart.data,
      mimeType: imagePart.mimeType || "image/png",
    };

  } catch (error) {
    console.error("Error generating logo:", error);
    throw error;
  }
};

export const generateLogoAnimation = async (
  imageBase64: string,
  prompt: string,
  aspectRatio: VideoAspectRatio
): Promise<string> => {
  const ai = getAI();
  const modelId = "veo-3.1-fast-generate-preview";

  try {
    let operation = await ai.models.generateVideos({
      model: modelId,
      prompt: prompt || "Animate this logo cinematically",
      image: {
        imageBytes: imageBase64,
        mimeType: "image/png", 
      },
      config: {
        numberOfVideos: 1,
        aspectRatio: aspectRatio,
        // Veo fast preview often defaults to 720p, but we can try requesting explicit if needed. 
        // Docs say 'resolution' can be 720p or 1080p. Let's default to 720p for speed/consistency in preview.
        resolution: '720p' 
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("Video generation failed or returned no URI.");
    }

    // Append API key to the download link as per instructions
    const downloadUrl = `${videoUri}&key=${process.env.API_KEY}`;
    return downloadUrl;

  } catch (error) {
    console.error("Error generating video:", error);
    throw error;
  }
};