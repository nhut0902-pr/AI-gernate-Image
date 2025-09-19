import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    if (!base64ImageBytes) {
       throw new Error('No image was generated in the response.');
    }
    return base64ImageBytes;
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw new Error("Failed to communicate with the AI model for image generation.");
  }
}

export async function editImage(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error('No image was generated in the response.');
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw new Error("Failed to communicate with the AI model for image editing.");
  }
}

export async function createVideoFromImage(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      image: {
        imageBytes: base64ImageData,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1
      }
    });

    // Poll for the result
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation completed, but no download link was provided.");
    }

    // Fetch the video data as a blob and create a local URL
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video file. Status: ${videoResponse.status}`);
    }
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error) {
    console.error("Error creating video with Gemini:", error);
    throw new Error("Failed to communicate with the AI model for video generation.");
  }
}