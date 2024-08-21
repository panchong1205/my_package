/**created by panchong in 2024/2/4**/
import {ReactNode, FC} from "react";
import './index.less';

interface FlexProps {
  /**
   * 布局排列方向 可输入row column
   */
  direction?: 'row' | 'column';
  /**
   * 水平对齐方式 start  center  end  between around
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /**
   *  垂直对齐方式 top middle bottom stretch
   */
  align?: 'top' | 'middle' | 'bottom' | 'stretch';
  className?: string;
  id?: string;
  wrap?: boolean;
  gap?: string | number;
  children: ReactNode | null | string | number | undefined;
  [property: string]: any;
}
const Flex = (props: FlexProps) => {
  const {
    children = null,
    className = '',
    id = '',
    direction = 'row',
    justify = 'start',
    align = 'middle',
    wrap = true,
    gap = 0,
    ...rest
  } = props;
  return (<div
    className={`${className} flex_${direction}_${justify} flex_vertical_${align} ${!wrap ? 'flex_nowrap' : ''}`}
    id={id}
    {...rest}
    style={{
      ...rest.style,
      gap,
    }}
  >
    {children}
  </div>)
};
export default Flex;

export const FlexAutoSize = (props: FlexProps) => {
  const {
    children = null,
    className = '',
    ...rest
  } = props;
  return (
    <div className={`flex_item_auto_size ${className}`} {...rest}>{children}</div>
  )
}
