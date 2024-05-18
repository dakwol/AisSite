
export const compressImage = async (file:any) => {
    const MAX_WIDTH = 800;
    const MAX_HEIGHT = 600;
    const image = new Image();
  
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        let width = image.width;
        let height = image.height;
  
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
  
        const ctx = canvas.getContext("2d");
        //@ts-ignore
        ctx.drawImage(image, 0, 0, width, height);
  
        canvas.toBlob((blob) => {
            //@ts-ignore
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };
  
      image.src = URL.createObjectURL(file);
    });
  };