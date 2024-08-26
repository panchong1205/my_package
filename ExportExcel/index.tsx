import React, {Ref, ReactNode, useState, useLayoutEffect, forwardRef, useImperativeHandle} from "react";
import {downloadFileBlob} from '../utils/index';
const ExcelJS = require('exceljs');

interface CustomProColumns{
  title?: string;
  dataIndex?: string;
  renderText?: (t:any, r: any, i: number) => void;
  onCell?: (r: any, i: number) => void;
  width?: number,
  horizontalAlign?: string | 'center' | 'left' | 'right';
  children?: CustomProColumns[],
}
interface exportPropsType{
  columns: CustomProColumns[];
  dataSource?: any[];
  fileName?: string;
  afterExport?: () => void;
  request?: () => void;
  children?: ReactNode | null | string | number | undefined;
}
interface excelColumns {
  header?: string | ReactNode;
  key?: string;
  style?: {
    alignment?: {
      vertical?: 'middle' | 'top' | 'bottom' | string;
      horizontal?: 'center' | 'left' | 'right' | string;
      wrapText?: boolean;
    },
  };
  width?: number | 'auto';
  onCell?: (record: any, index?: number) => void;
  renderText?: (text?: any, record?: any, index?: number) => void;
}
const Index = (WrapCom: any) => {
  return forwardRef((props: exportPropsType, ref:Ref<any>) => {
    const { columns, fileName, dataSource = [], afterExport, request } = props;
    const [workBook, setWorkBook] = useState(null);
    const renderSheet = (dataList) => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet();
      const sheetColumns: excelColumns[] = [];

      // 处理列项
      const getColumns = (c) => {
        c.forEach(item => {
          if (item?.children?.length > 0) {
            getColumns(item.children);
          } else {
            let columnItem: excelColumns = {
              header: '',
              key: item.dataIndex || '',
              style: {
                alignment: {
                  vertical: 'middle',
                  horizontal: item?.horizontalAlign || 'center',
                  wrapText: true,
                }
              },
              onCell: (r, i) => item?.onCell?.(r, i),
            };
            if (item?.renderText !== undefined || item?.render !== undefined) {
              columnItem = {
                ...columnItem,
                renderText: (t, r, i) => item?.renderText?.(t, r, i) || item?.render?.(t, r, i),
              }
            }
            if (item.width) {
              columnItem = {
                ...columnItem,
                width: item.width,
              }
            }
            sheetColumns.push(columnItem)
          }
        })
      }
      getColumns(columns);
      worksheet.columns = sheetColumns;

      // 多级表头时获取表头最多有多少层
      let theadLevel = 1;
      const getTheadLevel = (c) => {
        const findChildren = c?.filter(item => item?.children?.length > 0);
        if (findChildren?.length > 0) {
          theadLevel += 1;
          findChildren?.forEach(item => {
            getTheadLevel(item.children);
          })
        }
      }
      getTheadLevel(columns);

      let theadArray = new Array(theadLevel).fill([]);
      const handleThead = (c, deep) => {
        c.forEach((item, index) => {
          theadArray[deep] = theadArray[deep].concat([item.title]);
          if (index > 0) {
            for (let i = 0; i < deep; i++) {
              theadArray[i] = [...theadArray[i].slice(0, theadArray[deep].length - 1), '', ...theadArray[i].slice(theadArray[deep].length)]
            }
          }
          if (item?.children?.length > 0) {
            handleThead(item.children, deep + 1);
          } else {
            for (let i = deep + 1; i < theadLevel; i++) {
              theadArray[i] = theadArray[i].concat(['']);
            }
          }
        });
      }
      handleThead(columns, 0);
      theadArray?.forEach((item, index) => {
        if (index === 0) {
          worksheet.getRow(1).values = item;
        } else {
          worksheet.addRow(item);
        }
        let colSpan = 0;
        item.forEach((item2, index2) => {
          if (item2) {
            if (colSpan > 1) {
              worksheet.mergeCells(index + 1, index2 - colSpan + 1 , index + 1, index2);
            }
            colSpan = 1;
          } else {
            if (colSpan > 0) {
              colSpan += 1;
            }
            if (index2 >= item.length - 1 && colSpan > 1) {
              worksheet.mergeCells(index + 1, index2 + 1 - colSpan + 1 , index + 1, index2 + 1);
            }
          }
        })
      });
      const handleMergeThead = (c, rowIndex) => {
        c.forEach((item, index) => {
          if (!item?.children) {
            if (rowIndex < theadLevel) {
              let s = rowIndex;
              let e = theadLevel;
              const colIndex = theadArray[rowIndex - 1].findIndex(item2 => item2 === item.title);
              worksheet.mergeCells(s, (colIndex + 1), e, (colIndex + 1));
            }
          } else {
            handleMergeThead(item.children, rowIndex + 1);
          }
        })
      }
      handleMergeThead(columns, 1);


      dataList?.forEach((item, index) => {
        sheetColumns.forEach((item2, index2) => {
          item[item2.key] = item2?.renderText !== undefined ? item2?.renderText?.(item[item2.key], item, index) : item[item2.key];
        });
        worksheet.addRow(item);
      })
      dataList?.forEach((item, index) => {
        // 处理合并行合并列的情况
        sheetColumns.forEach((item2, index2) => {
          const cellSpan = item2?.onCell?.(item, index);
          if (cellSpan?.rowSpan > 1) {
            const s = theadLevel + 1 + index;
            const e = s + cellSpan?.rowSpan - 1;
            worksheet.mergeCells(s, index2 + 1 , e, index2 + 1);
          }
          if (cellSpan?.colSpan > 1) {
            const s = 1 + index2;
            const e = s + cellSpan?.colSpan - 1;
            worksheet.mergeCells(theadLevel + 1 + index, s , theadLevel + 1 + index, e);
          }
        })
      })
      setWorkBook(workbook);
      return workbook;
    }
    useLayoutEffect(() => {
      renderSheet(dataSource);
    }, [ columns, dataSource]);
    const onExport = async () => {
      if (!dataSource?.length && !!request) {
        const res = await request();
        const getWorkbook = renderSheet(res?.data);
        getWorkbook?.xlsx?.writeBuffer().then(r => {
          downloadFileBlob({
            fileName,
            fileType: 'excel',
            blob: r,
            onDownloadSuccess: () => afterExport?.(),
          });
        });
        return;
      }
      workBook?.xlsx?.writeBuffer().then(r => {
        downloadFileBlob({
          fileName,
          fileType: 'excel',
          blob: r,
          onDownloadSuccess: () => afterExport?.(),
        });
      });
    }
    useImperativeHandle(ref, () => {
      return {
        export: () => onExport(),
      }
    })
    return (
      <WrapCom
        onClick={onExport}
      >
        {props.children}
      </WrapCom>
    )
  })
}
const CustomExportExcel = (props: { children?: ReactNode; onClick?:() => void}) => {
  return (<div onClick={props.onClick}>
    {props.children || <div />}
  </div>)
};
export default Index(CustomExportExcel);
