/**
 * Created by bo.liu01 on 2017/11/15.
 */


/**
 * 求两个数组的差集，arr1-arr2
 * @param arr1
 * @param arr2
 * @returns {Array}
 */
export function subtraction(arr1, arr2) {
  var result = new Array();
  var obj = {};
  for (let i = 0; i < arr2.length; i++) {
    obj[arr2[i]] = 1;
  }
  for (let j = 0; j < arr1.length; j++) {
    if (!obj[arr1[j]]) {
      //obj[arr1[j]] = 1;
      result.push(arr1[j]);
    }
  }
  return result;
};

export function getMapFromArr(arr, key, value) {
	if(!key){
		key = 'value';
	}
	if(!value){
		value = 'name';
	}
	var mapping = {};
	for (let i = 0; i < arr.length; i++) {
	    mapping[arr[i][key]] = arr[i][value];
	}
	return mapping;
}

export function copyArr(origArr) {
	if(origArr){
		let newArr = [];
		origArr.forEach((item, i)=>{
			newArr.push(item);
		});
		return newArr;
	}
	return [];
}
