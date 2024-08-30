import { Ref,ReactNode, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';

const Index = (WrapCom: any) => {
    return forwardRef((props: { onGetShot?: (p: any) => void;  children?: ReactNode;}, ref: Ref<{ shot?: () => void }>) => {

        let sreaming:boolean = false;
        const screenShotVideo = useMemo(() => {
          let videoDom = document.getElementById('screenShotVideo');
          if (!videoDom) {
            const video = document.createElement("video");
            video?.setAttribute('id', 'screenShotVideo');
            video?.setAttribute('width', '0');
            video?.setAttribute('height', '0');
            video?.setAttribute('preload', 'auto');
            video?.setAttribute('style', 'left: 0; position:"fixed";');
            document.body.appendChild(video);
            videoDom = document.getElementById('screenShotVideo');
          }
          return videoDom;
        }, []);
        const screenShotCanvas = useMemo(() => {
          let canvasDom = document.getElementById('screenShotCanvas');
          if (!canvasDom) {
            const canvas = document.createElement("canvas");
            canvas?.setAttribute('id', 'screenShotCanvas');
            canvas?.setAttribute('width', '0');
            canvas?.setAttribute('height', '0');
            canvas?.setAttribute('style', 'top: 0; position:"fixed";');
            document.body.appendChild(canvas);
            canvasDom = document.getElementById('screenShotCanvas');
          }
          return canvasDom;
        }, []);
        const initialScreenShotSize = () => { // 录屏设置初始化
          screenShotVideo?.setAttribute('width', '0');
          screenShotVideo?.setAttribute('height', '0');
          screenShotVideo?.setAttribute('style', 'left: 0; position:"fixed";');

          screenShotCanvas?.setAttribute('width', '0');
          screenShotCanvas?.setAttribute('height', '0');
          screenShotCanvas?.setAttribute('style', 'top: 0; position:"fixed";');
        };
        const takepicture = () => {
          console.log('takepicture')
            const context = screenShotCanvas?.getContext('2d');
            const width = Number(screenShotCanvas?.width);
            const height = Number(screenShotCanvas?.height);
            context.drawImage(screenShotVideo, 0, 0, width, height);
            const imgDataUrl = screenShotCanvas?.toDataURL('image/png', 2.0);
            const tracks = screenShotVideo?.srcObject?.getTracks();
            tracks?.forEach((track: any) => track.stop());
            props?.onGetShot?.(imgDataUrl);
            initialScreenShotSize();
        }
        const videoCanplay = () => {
          if ( !sreaming) {
            const clientWidth = Number(document.body.clientWidth);
            const clientHeight = Number(document.body.clientHeight);
            const videoHeight = 900;
            const videoWidth = Number(((clientWidth * videoHeight) / clientHeight).toFixed(2));
            const canvasWidth = Number((videoWidth * 0.9).toFixed(2));
            const canvasHeight = Number((videoHeight * 0.9).toFixed(2));
            screenShotVideo?.setAttribute('width', videoWidth.toString());
            screenShotVideo?.setAttribute('height', videoHeight.toString());
            screenShotVideo?.setAttribute('style', `left: -${videoWidth + 10}px; position:"fixed";`);
            screenShotCanvas?.setAttribute('width', canvasWidth.toString());
            screenShotCanvas?.setAttribute('height', canvasHeight.toString());
            screenShotCanvas?.setAttribute('style', `top: -${canvasHeight + 10}px; position:"fixed";`);
            sreaming = true;
          }
            setTimeout(() => {
                takepicture();
            }, 500);
        }
        const onShot = async (e?: any) => {
            e?.preventDefault?.();
            sreaming = false;
            const mediaStream = await  window.navigator.mediaDevices.getDisplayMedia({
              video: {
                displaySurface: "window",
              },
            });
          screenShotVideo.srcObject = mediaStream;
          screenShotVideo.play();
        };
        useImperativeHandle(ref, () => {
            return {
                shot: () => onShot?.(),
            }
        })
        useEffect(() => {
            initialScreenShotSize?.();
          screenShotVideo?.addEventListener('canplay', videoCanplay, false);
            let timeout = null;
            window.onresize = () => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                timeout = setTimeout(() => {
                    initialScreenShotSize();
                }, 300);
            }
            return () => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                window.onresize = null;
              screenShotVideo?.removeEventListener('canplay', videoCanplay);
            }
        }, [])
        return (
          <WrapCom onClick={onShot}>
            {props.children}
          </WrapCom>
        )
    })
}

const Custom = (props: { children?: ReactNode; onClick?:() => void}) => {
    return (<div onClick={props.onClick}>
        {props.children || <div />}
    </div>)
};
export default Index(Custom);
