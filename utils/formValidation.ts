const formValidation = {
    trim(obj) {
        try {
            return obj.trim();
        } catch (e) {
            return obj;
        }
    },
    isEmpty(content) {
        const obj = content === null || content === undefined ? '' : this.trim(content);
        return obj.length !== 0;
    },
    isPhone(content) { // 手机
        return /^1[23456789]\d{9}$/.test(content);
    },
    isMobile(content) { // 手机或座机
        return /^1[23456789]\d{9}$/.test(content) || /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(content);
    },
    isMail(content) {
        return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(content);
    },
    isPositiveNumber(content) { // 正整数
        return /^[1-9]*[1-9][0-9]*$/.test(content);
    },
    isPositiveOrZero(content) { // 正整数或0
        return /^([1-9]\d*|[0]{1,1})$/.test(content);
    },
    isCh_Num_En(content) { // 只能包含中文或数字或字母
        return /^[a-zA-Z0-9\u4e00-\u9fa5]/.test(content);
    },
    isNumberLetter(content) { // 字母数字
        return /^[A-Za-z0-9]+$/.test(content);
    },
    isNumLetterDash(content) { // 字母数字-
        return /^[A-Za-z0-9-]+$/.test(content);
    },
    isNumComma(content) { // 数字和英文逗号
        return /^[0-9,]+$/.test(content);
    },
    has_letter_number_symbol(content) { // 大小写字母、数字、特殊字符，长度8～12位
        return  /^(?=.*[0-9].*)(?=.*[!@#$%^&*].*)(?=.*[a-z].*)(?=.*[A-Z].*).{8,20}$/.test(content);
    }
};
export default formValidation;