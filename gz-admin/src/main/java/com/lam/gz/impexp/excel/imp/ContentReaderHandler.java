package com.lam.gz.impexp.excel.imp;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.lam.gz.impexp.excel.imp.model.ContentData;

/**
 * Excel读处理工具接口
 * @author bo.liu01
 *
 */
public interface ContentReaderHandler {

	/**
	 * 返回该读处理器需要处理的行数
	 * @return 如果 <1 则表示无限处理，且后续的处理器将会被忽略
	 */
	int getRangeNum();
	
	/**
	 * 设置该读处理器需要处理的行数，
	 * 如果 rangeNum<1 则表示无限处理，且后续的处理器将会被忽略
	 * @param rangeNum
	 * @return
	 */
	ContentReaderHandler setRangeNum(int rangeNum);

	/**
	 * 准备读取数据
	 * @param sheet
	 * @param sheetExecutor
	 * @return
	 * @throws Exception 
	 */
	ContentReaderHandler ready(Sheet sheet, SheetReaderExecutor sheetExecutor) throws Exception;
	
	/**
	 * 读取数据
	 * @param sheet
	 * @param sheetExecutor
	 * @param row 当前行数据对象
	 * @param cursor 当前行号
	 * @return
	 * @throws Exception
	 */
	boolean read(Sheet sheet, SheetReaderExecutor sheetExecutor, Row row, int cursor) throws Exception;

	/**
	 * 完成读取数据
	 * @param sheet
	 * @param sheetExecutor
	 * @return
	 */
	ContentData complete(Sheet sheet, SheetReaderExecutor sheetExecutor);
	/**
	 * 设置开始的行号
	 * @param startRow
	 * @return
	 */
	ContentReaderHandler setStartRow(int startRow);

	/**
	 * 获取开始的行号
	 * @param startRow
	 * @return
	 */
	int getStartRow();

	/**
	 * 设置内容的序号
	 * @param index
	 * @return
	 */
	ContentReaderHandler setIndex(int index);

	/**
	 * 设置sheet
	 * @param sheet
	 */
	void setSheet(Sheet sheet);

	/**
	 * 设置workbook
	 * @param workbook
	 */
	void setWorkbook(Workbook workbook);

}
