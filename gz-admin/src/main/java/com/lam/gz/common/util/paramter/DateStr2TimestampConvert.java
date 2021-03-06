package com.lam.gz.common.util.paramter;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.lam.gz.common.exception.BaseException;

/**
 * 将指定格式的字符串时间转成13位时间戳
 * @date 2017年5月12日
 * @author liubo04
 */
public class DateStr2TimestampConvert implements ParameterConvert{

	private static final Logger logger = LoggerFactory.getLogger(DateStr2TimestampConvert.class);

	@Override
	public Object convert(Object obj, String format) {
		if(obj == null){
			return null;
		}
		try {
			return new SimpleDateFormat(format).parse(String.valueOf(obj)).getTime();
		} catch (ParseException e) {
			logger.error("参数转换失败，srcObj:{}, format:{}", obj, format);
			throw new BaseException("参数转换失败");
		}
	}

}
