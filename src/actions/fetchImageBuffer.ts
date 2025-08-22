export const getImageBuffer = async (url: string): Promise<Buffer | undefined> => {
  try {
    const response = await fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch (error: any) {
    let errorData = {
      status: error.status,
      statusText: error.statusText,
    };
    console.error("Error fetching the image:", errorData);
    return;
  }
};

export const fetchImageBuffer = async (input: string): Promise<Buffer | undefined> => {
  const isInlineSVG = input.trim().startsWith("<svg");

  if (isInlineSVG) {
    return Buffer.from(input, "utf-8");
  } else {
    return await getImageBuffer(input);
  }
};
