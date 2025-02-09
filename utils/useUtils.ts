export const useUtils = () => {


  /**
   * null or undefined or スペースを''に変換して返却する
   * @param str 
   * @returns 
   */
  const toBlank = (str: string) => {
    if (str === null || str === undefined) {
      str = ''
    }
    return str.trim()
  }

  /**
   * null or undefined を0に変換して返却する
   * @param str 
   * @returns 
   */
  const toZero = (num: number) => {
    if (num === null || num === undefined) {
      num = 0
    }
    return num
  }

  const toNumber = (str: string) => {
    if (typeof str !== "string" || str.trim() === "") return NaN;
    return parseInt(str, 10);
  }

  /** 
 * 内部共通関数：0,1の配列を時間へ変換する
 */
  const getTimeRanges = (hours: []) => {
    const result = [];
    let start = null;

    for (let i = 0; i < hours.length; i++) {
      if (hours[i] === 1 && start === null) {
        start = i; // 1の開始時間を記録
      }
      if ((hours[i] === 0 || i === hours.length - 1) && start !== null) {
        let end = i;
        if (hours[i] === 1) end++; // 23時が1の場合は範囲を拡張
        result.push(`${start}時-${end - 1}時`);
        start = null; // リセット
      }
    }

    return result.join(", ");
  }


  return {
    toBlank,
    toZero,
    toNumber,
    getTimeRanges,
  }


}