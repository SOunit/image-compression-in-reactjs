import React, { FC, useEffect, useState } from "react";
import Compressor from "compressorjs";

type Props = {};
type SizesProps = {
  sizeBefore: number;
  sizeAfter: number;
  sizeRatio: number;
};

const Upload: FC<Props> = () => {
  const [compressedFile, setCompressedFile] = useState<File | Blob>();
  const [preview, setPreview] = useState<string>();
  const [sizes, setSizes] = useState<SizesProps>({
    sizeBefore: 0,
    sizeAfter: 0,
    sizeRatio: 0,
  });

  const handleCompressedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      setSizes((prev) => {
        return { ...prev, sizeBefore: image.size };
      });

      new Compressor(image, {
        quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
        maxWidth: 680,
        maxHeight: 680,
        success: (compressedResult) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          setSizes((prev) => {
            const sizeBefore = prev.sizeBefore;
            const sizeAfter = compressedResult.size;
            const sizeRatio = Math.floor((sizeAfter / sizeBefore) * 100);
            return { ...prev, sizeAfter, sizeRatio };
          });

          const compressedFile = new File(
            [compressedResult],
            (compressedResult as any).name,
            {
              type: compressedResult.type,
            }
          );

          setCompressedFile(compressedFile);
        },
      });
    }
  };

  useEffect(() => {
    if (compressedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      console.log(sizes);

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
    }
  }, [compressedFile]);

  return (
    <div>
      <div>
        <input
          accept="image/*,capture=camera"
          // capture="camera"
          type="file"
          onChange={(event) => handleCompressedUpload(event)}
        />
      </div>

      <div>
        <h2>before</h2>
        {sizes.sizeBefore}
        <h2>after</h2>
        {sizes.sizeAfter}
        <h2>ratio</h2>
        {sizes.sizeRatio}%
      </div>

      {preview && (
        <div>
          <img src={preview} alt={(preview as any).name} />
        </div>
      )}
    </div>
  );
};

export default Upload;
