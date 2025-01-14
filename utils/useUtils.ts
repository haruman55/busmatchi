export const useUtils = () => {
// null or undefined or スペースを''に変換して返却する
const toBlank = (str: string) => {
    if (str === null || str === undefined) {
      str = ''
    }
    return str.trim()
  } 
  return {
    toBlank
  }
}