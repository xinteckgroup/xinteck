export const convertToWebP = async (file: File): Promise<File> => {
    // Only convert static images, skip gifs and non-images
    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
        return file;
    }

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(file); // Fallback to original

                ctx.drawImage(img, 0, 0);

                // Convert to WebP format with 0.90 quality
                canvas.toBlob((blob) => {
                    if (!blob) return resolve(file);

                    // Replace original extension with .webp
                    const newName = file.name.replace(/\.[^/.]+$/, ".webp");

                    const webpFile = new File([blob], newName, {
                        type: 'image/webp',
                        lastModified: Date.now(),
                    });

                    resolve(webpFile);
                }, 'image/webp', 0.90);
            };

            img.onerror = () => resolve(file); // Fallback on error
            img.src = e.target?.result as string;
        };

        reader.onerror = () => resolve(file); // Fallback on error
        reader.readAsDataURL(file);
    });
};
