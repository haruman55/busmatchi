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

  return {
    toBlank,
    toZero
  }


}