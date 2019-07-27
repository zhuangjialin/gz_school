package com.lam.gz.impexp.excel.imp;

import java.util.List;

import com.lam.gz.impexp.excel.imp.model.SheetData;

/**
 * @author bo.liu01
 *
 */
public interface ExcelReader {

	/**
     * 读取文件
     * @return
     * @author liubo04
     */
	List<SheetData> read();
	
}
