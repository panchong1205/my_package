/**created by panchong on 2018/1/10**/
const getMimiType = (option, value) => {
    const mimeTypes = window.navigator.mimeTypes;
    for (const mt in mimeTypes) {
        if (mimeTypes[mt][option] === value) {
            return true
        }
    }
    return false
}

const ua = window.navigator.userAgent.toLowerCase();
const platform = window.navigator.platform.toLowerCase();
const isWin = (platform === 'win32') || (platform === 'windows'); // windows系统
const isMac = (platform === 'mac68k') || (platform === 'macppc') || (platform === 'macintosh') || (platform === 'macintel'); //Mac系统
const isUnix = (platform === 'x11') && !isWin && !isMac; // Unix系统
const isLinux = !!platform.match(/linux/); // Linux系统

const isIE = !!ua.match(/msie/) || !!ua.match(/trident/); //IE浏览器
const isFirefox = !!ua.match(/firefox/); // 火狐浏览器
const isUC = !!ua.match(/ucbrowser/); // UC浏览器
const isOpera = !!ua.match(/opera/) || !!ua.match(/opr/); //Opera浏览器
const isBaidu = !!ua.match(/bidubrowser/) ; //百度浏览器
const isSougou = !!ua.match(/metasr/) ; //搜狗浏览器
const isQQ = !!ua.match(/tencenttraveler/)|| !!ua.match(/qqbrowse/); // QQ浏览器
const isChrome = !!ua.match(/chrome/); //谷歌浏览器
const is360 = isChrome && getMimiType('type', 'application/vnd.chromium.remoting-viewer'); // 360浏览器
const isSafari = !!ua.match(/safari/); //Safari浏览器
const isWeixin = !!ua.match(/micromessenger/); //微信内置浏览器
const isAndroid = !!ua.match(/android/); //Android
const isIphone = !!ua.match(/iphone/); //Iphone
const isIpad = !!ua.match(/ipad/); //ipad
const isIpod = !!ua.match(/ipod/); //ipod
const isWindowsPhone = !!ua.match(/windows phone/); //WindowsPhone

const isMobile = isAndroid || isIpod || isIphone || isIpad || isWindowsPhone

const deviceDetection = {
    isWin,
    isMac,
    isUnix,
    isLinux,
    isIE,
    isFirefox,
    isUC,
    isOpera,
    isBaidu,
    isQQ,
    isSougou,
    isChrome,
    is360,
    isSafari,
    isWeixin,
    isAndroid,
    isIphone,
    isIpad,
    isIpod,
    isWindowsPhone,
    isMobile,
};

export default deviceDetection;



