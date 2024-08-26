/**
 *
 * @param num 需要格式化的数字
 * @param digit 需要保留的小数位数 默认0
 * @param divide 是否显示千分位分隔符 默认false
 *
 */
const formatNum = (
    {
      num,
      digit = 0,
      divide = false,
    }: {
      num: number | string | undefined | null,
      digit?: number,
      divide?: boolean,
    }
) => {
  if (num === undefined || num === null) {
    return '-';
  }
  let res = Number(Number(num)?.toFixed?.(digit))?.toString();
  let intPart = res?.includes?.('.') ? res?.split('.')[0] : res;
  let digitPart = res?.includes?.('.') ? res?.split('.')[1] : '';
  let newInt = '';
  let intLen = intPart?.length;
  if (intLen > 3 && divide) {
    // 处理增加千分符
    while (intLen > 0) {
      if (intLen >= 3) {
        newInt = `${intPart.substr(intLen - 3, intLen)}${!!newInt ? ',' : ''}${newInt}`;
        intPart = intPart.substr(0, intLen - 3);
      } else {
        newInt = `${intPart.substr(0, intLen)}${!!newInt ? ',' : ''}${newInt}`;
        intPart = intPart.substr(0, intLen);
      }
      intLen -= 3;
    }
    return `${newInt}${!!digitPart ? '.' : ''}${digitPart}`;
  }
  return Number(num)?.toFixed?.(digit)
};

export default formatNum;
