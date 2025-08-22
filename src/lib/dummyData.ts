export const getDummyArray = (count: number) => {
  return Array.from({ length: count }, (_, index) => index + 1);
};
