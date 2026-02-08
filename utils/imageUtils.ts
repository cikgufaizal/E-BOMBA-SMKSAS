
/**
 * Memampatkan imej kepada saiz sasaran (Default: 300KB)
 * 1. Resize dimensi kepada maks 1000px
 * 2. Kurangkan kualiti JPEG secara berperingkat sehingga saiz fail dicapai
 */
export const compressImage = async (file: File, targetSizeKB: number = 300): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // 1. Initial Resize (Max Dimension 1000px - good balance for 300kb)
        const MAX_DIMENSION = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
           reject(new Error("Canvas Error"));
           return;
        }
        
        // Lukis imej pada kanvas (White background untuk transparent PNG yang ditukar ke JPEG)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // 2. Compress Quality Loop
        let quality = 0.9;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Kira saiz anggaran (Base64 length * 0.75 = Bytes)
        const targetBytes = targetSizeKB * 1024;

        while (dataUrl.length * 0.75 > targetBytes && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
