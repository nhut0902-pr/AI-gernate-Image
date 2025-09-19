
export const fileToBase64 = (file: File): Promise<{ b64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const b64 = result.split(',')[1];
      const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
      if (b64 && mimeType) {
        resolve({ b64, mimeType });
      } else {
        reject(new Error("Failed to parse file data."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
