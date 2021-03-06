package com.lam.gz.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.lam.gz.admin.common.AdminModule;
import com.lam.gz.admin.service.OperLogService;
import com.lam.gz.admin.vo.OperLogVo;
import com.lam.gz.common.base.BaseController;
import com.lam.gz.common.response.ObjectResponse;
import com.lam.gz.common.response.ResultResponse;
import com.lam.gz.common.response.TableResponse;
import com.lam.gz.log.annotation.OperateLog;
import com.lam.gz.log.entity.OperateLogsEntity;
import com.lam.gz.log.interceptor.ParameterType;
import com.lam.gz.log.operatelog.Operation;

/**
 * 操作日志表控制类
 * @date 2018-7-12 10:48:45
 * @author bo.liu01
 */
@OperateLog(module = AdminModule.OPER_LOG)
@Controller
@RequestMapping("operLog")
public class OperLogController extends BaseController {
	
	@Autowired
	private OperLogService operLogService;
	   
	/**
	 * 分页查询
	 * @date 2018-7-12 10:48:45
	 * @author bo.liu01
	 */
	@OperateLog(oper= Operation.QUERY_BY_PAGE, parameterType= ParameterType.QUERY)
	@ResponseBody
	@RequestMapping(value="listByPage", method=RequestMethod.GET)
	public ResultResponse listByPage(OperLogVo operLogVo){
		
		return new TableResponse(operLogService.listByPage(operLogVo));
	}
	
	
	/**
	 * 查询单条记录，默认根据ID查询，如有修改条件，请在此备注
	 * @date 2018-7-12 10:48:45
	 * @author bo.liu01
	 */
	@OperateLog(oper=Operation.SINGLE_QUERY, parameterType=ParameterType.QUERY)
	@ResponseBody
	//@RequestMapping(value="find", method=RequestMethod.GET)
	public ResultResponse find(OperLogVo operLogVo){

		OperateLogsEntity operLogEntity = operLogService.find(operLogVo);
		if(operLogEntity != null){
			return new ObjectResponse(true).data(operLogEntity);
		}else{
			return new ObjectResponse(false).msg("该记录不存在");
		}
	}
	
}