export const convertToETH = (wei) => {
  return (parseFloat(wei) / Math.pow(10, 18)).toString();
};

export const convertToDecimal = (hexCode) => {
  return parseInt(hexCode.substring(2), 16);
};
