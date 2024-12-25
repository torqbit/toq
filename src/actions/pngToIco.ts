// https://github.com/steambap/png-to-ico
import type { OutputInfo, Sharp } from "sharp";

const constants = {
  bitmapSize: 40,
  colorMode: 0,
  directorySize: 16,
  headerSize: 6,
};

export async function toIco(image: Sharp, sizeList: number[]) {
  const { info } = await image.toBuffer({ resolveWithObject: true });
  const size = info.width;
  if (info.format !== "png" || size !== info.height) throw new Error("Please give me a square PNG image.");

  const resizedImages = sizeList.map((targetSize) =>
    image.clone().resize(targetSize, targetSize, {
      kernel: "cubic",
      // Jimp.RESIZE_BICUBIC
    })
  );

  return await imagesToIco(resizedImages);
}

async function imagesToIco(images: Sharp[]) {
  const header = getHeader(images.length);
  const headerAndIconDir = [header];
  const imageDataArr = [];

  let len = header.length;
  let offset = header.length + 16 * images.length;

  for (const img of images) {
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

    const dir = getDir(info, offset);
    const bmpInfoHeader = getBmpInfoHeader(info);
    const dib = getDib(data, info);

    headerAndIconDir.push(dir);
    imageDataArr.push(bmpInfoHeader, dib);

    len += dir.length + bmpInfoHeader.length + dib.length;
    offset += bmpInfoHeader.length + dib.length;
  }

  return Buffer.concat(headerAndIconDir.concat(imageDataArr), len);
}

// https://en.wikipedia.org/wiki/ICO_(file_format)
function getHeader(numOfImages: number) {
  const buf = Buffer.alloc(constants.headerSize);

  buf.writeUInt16LE(0, 0); // Reserved. Must always be 0.
  buf.writeUInt16LE(1, 2); // Specifies image type: 1 for icon (.ICO) image
  buf.writeUInt16LE(numOfImages, 4); // Specifies number of images in the file.

  return buf;
}

function getDir(info: OutputInfo, offset: number) {
  const buf = Buffer.alloc(constants.directorySize);
  const size = info.size + constants.bitmapSize;
  const width = info.width >= 256 ? 0 : info.width;
  const height = info.height >= 256 ? 0 : info.height;
  const bpp = 4 * 8;

  buf.writeUInt8(width, 0); // Specifies image width in pixels.
  buf.writeUInt8(height, 1); // Specifies image height in pixels.
  buf.writeUInt8(0, 2); // Should be 0 if the image does not use a color palette.
  buf.writeUInt8(0, 3); // Reserved. Should be 0.
  buf.writeUInt16LE(1, 4); // Specifies color planes. Should be 0 or 1.
  buf.writeUInt16LE(bpp, 6); // Specifies bits per pixel.
  buf.writeUInt32LE(size, 8); // Specifies the size of the image's data in bytes
  buf.writeUInt32LE(offset, 12); // Specifies the offset of BMP or PNG data from the beginning of the ICO/CUR file

  return buf;
}

// https://en.wikipedia.org/wiki/BMP_file_format
function getBmpInfoHeader(info: OutputInfo) {
  const buf = Buffer.alloc(constants.bitmapSize);
  const width = info.width!;
  // https://en.wikipedia.org/wiki/ICO_(file_format)
  // ...Even if the AND mask is not supplied,
  // if the image is in Windows BMP format,
  // the BMP header must still specify a doubled height.
  const height = width * 2;
  const bpp = 32;

  buf.writeUInt32LE(constants.bitmapSize, 0); // The size of this header (40 bytes)
  buf.writeInt32LE(width, 4); // The bitmap width in pixels (signed integer)
  buf.writeInt32LE(height, 8); // The bitmap height in pixels (signed integer)
  buf.writeUInt16LE(1, 12); // The number of color planes (must be 1)
  buf.writeUInt16LE(bpp, 14); // The number of bits per pixel
  buf.writeUInt32LE(0, 16); // The compression method being used.
  buf.writeUInt32LE(info.size, 20); // The image size.
  buf.writeInt32LE(0, 24); // The horizontal resolution of the image. (signed integer)
  buf.writeInt32LE(0, 28); // The vertical resolution of the image. (signed integer)
  buf.writeUInt32LE(0, 32); // The number of colors in the color palette, or 0 to default to 2n
  buf.writeUInt32LE(0, 36); // The number of important colors used, or 0 when every color is important; generally ignored.

  return buf;
}

// https://en.wikipedia.org/wiki/BMP_file_format
// Note that the bitmap data starts with the lower left hand corner of the image.
// blue green red alpha in order
function getDib(data: Buffer, info: OutputInfo) {
  const bpp = 4;
  const cols = info.width * bpp;
  const rows = info.height * cols;
  const end = rows - cols;
  const buf = Buffer.alloc(info.size);
  // xor map
  for (let row = 0; row < rows; row += cols) {
    for (let col = 0; col < cols; col += bpp) {
      let pos = row + col;
      const r = data.readUInt8(pos);
      const g = data.readUInt8(pos + 1);
      const b = data.readUInt8(pos + 2);
      const a = data.readUInt8(pos + 3);

      pos = end - row + col;
      buf.writeUInt8(b, pos);
      buf.writeUInt8(g, pos + 1);
      buf.writeUInt8(r, pos + 2);
      buf.writeUInt8(a, pos + 3);
    }
  }

  return buf;
}
