
interface downloadFileBlobProps{
    fileName: string;
    fileType: 'excel' | 'word',
    blob: any;
    onDownloadSuccess?: () => void;
}
const downloadFileBlob = (
    {
        fileName = '',
        fileType = 'excel',
        blob = null,
        onDownloadSuccess = () => {},
    }: downloadFileBlobProps
) => {
    if (!blob) {
        return;
    }
    let type = '';
    switch (fileType) {
        default:break;
        case 'excel': type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'; break;
        case 'word': type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'; break;
    }
    let blobObject = new Blob([blob],{ type })
    let url = window.URL.createObjectURL(blobObject);
    // 创建a标签
    let ele = document.createElement("a")
    ele.style.display = 'none'
    ele.href = url
    ele.download = fileName;
    document.querySelectorAll("body")[0].appendChild(ele);
    ele.click();
    ele.remove();
    onDownloadSuccess?.();
}
export default downloadFileBlob;
