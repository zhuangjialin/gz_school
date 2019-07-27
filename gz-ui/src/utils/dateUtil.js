/**
 * Created by bo.liu01 on 2017/10/16.
 */
// /////////////////////////////////////////

/**
 * 给定年份是否闰年
 * @param year
 * @returns {boolean} true是闰年
 */
export function isLeepYear(year) {
  	return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

/**
 * 获取指定月份的天数
 * @param month
 * @returns {number}
 */
export function getMonthDayCount(year, month) {
	switch (month) {
	    case 1:
	    case 3:
	    case 5:
	    case 7:
	    case 8:
	    case 10:
	    case 12:return 31;
	    case 4:
	    case 6:
	    case 9:
	    case 11:return 30;
	    case 2:return isLeepYear(year) ? 29 : 28;
	    default: return 0;
	}
}

/**
 * 获取给定时间的相同月的最后一天的最后时刻，例如：给一个时间2017-10-17 15:45:12 返回2017-10-31 23:59:59
 * @param date
 * @returns {null}
 */
export function getMonthLastDate(date) {
	if(date instanceof Date) {
	    const _date = new Date();
	    _date.setFullYear(date.getFullYear());
	    _date.setMonth(date.getMonth());
	    _date.setDate(getMonthDayCount(date.getFullYear(), (date.getMonth()+1)));
	    _date.setHours(23);
	    _date.setMinutes(59);
	    _date.setSeconds(59);
	    return _date;
	} else {
	    return null;
	}
}

/**
 * 获取给定时间的相同月的第一天的开始时刻，例如：给一个时间2017-10-17 15:45:12 返回2017-10-01 00:00:00
 * @param date
 * @returns {null}
 */
export function getMonthFirstDate(date) {
	if(date instanceof Date) {
	    let _date = new Date();
	    _date.setFullYear(date.getFullYear());
	    _date.setMonth(date.getMonth());
	    _date.setDate(1);
	    _date.setHours(0);
	    _date.setMinutes(0);
	    _date.setSeconds(0);
	    return _date;
	} else {
	    return null;
	}
}

/**
 * 对比两个时间对象是否在同一个月内
 * @param date1
 * @param date2
 * @returns {boolean}
 * Created by bo.liu01 on 2017/10/16.
 */
export function compareDateIsSameMonth(date1, date2){
	if(date1 && date2 && date1 instanceof Date && date2 instanceof Date){
	    return date1.getFullYear() == date2.getFullYear()
	      && date1.getMonth() == date2.getMonth()
	}else{
	    return false;
	}
}

/**
 * 格式化时间
 * @param date 日期对象
 * @param fmt 格式字符串
 * @returns {*}
 * Created by bo.liu01 on 2017/10/16.
 */
export function formatDate(date, fmt) {
	if(!(date instanceof Date) || !fmt){
	    return null;
	}
	if (/(y+)/.test(fmt)) {
	    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let o = {
	    'M+': date.getMonth() + 1,
	    'd+': date.getDate(),
	    'h+': date.getHours(),
	    'm+': date.getMinutes(),
	    's+': date.getSeconds()
	};
	for (let k in o) {
	    if (new RegExp(`(${k})`).test(fmt)) {
	      let str = o[k] + '';
	      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
	    }
	}
	return fmt;
};

function padLeftZero(str) {
  	return ('00' + str).substr(str.length);
}

/**
 * 获取n天后的时间
 * @param n 天数,如果是负值则表示n天前
 * @param fmt 格式字符串，不传则返回时间对象
 * @returns {*}
 * Created by bo.liu01 on 2017/10/16.
 */
export function getDurationDate(n, fmt){
	if(!n){
		n = 0;
	}
	let date = new Date(new Date().getTime() + 86400*1000*n);
	return fmt ? formatDate(date, fmt): date;
}

/**
 * 获取n天后的时间字符串
 * @param n 天数,如果是负值则表示n天前
 * @returns {*}
 * Created by bo.liu01 on 2017/10/16.
 */
export function getDurationDateStr(n){
	return getDurationDate(n, 'yyyy-MM-dd');
}
