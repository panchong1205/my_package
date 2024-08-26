##
Flex布局组件
###
有效属性：

* direction：布局排列方向，可选。可输入row（横向）、 column（纵向）。默认值row。
* justify：水平对齐方式，可选。'start' | 'center' | 'end' | 'between' | 'around'。默认值start。
* align：垂直对齐方式，可选。'top' | 'middle' | 'bottom' | 'stretch'。默认值middle。
* wrap：是否自动换行，可选。默认值true。
* gap：子元素间隔，可选。默认值0.
* className：自定义类名，可选。
* id：自定义id，可选。

````
import { Flex, FlexAutoSize } from 'pc1205_packages';

export default () => {
    return (
        <Flex direction="row" justify="between" align="middle">
            <div>左边元素</div>
            <FlexAutoSize>
            /**右边元素会自动撑满**/
                右边元素
            </FlexAutoSize>
        </Flex>
    )
}
````