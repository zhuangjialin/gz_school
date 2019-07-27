/**
 * Created by bo.liu01 on 2017/11/2.
 */
"use strict";

export function Pager(){
  return {
    curPage:1,
    pageSize:10,
    totalSize:0,
    sizes:[10, 20, 30, 50, 80],
    //layout : "total, sizes, prev, pager, next, jumper",
    layout : "total, sizes, prev, pager, next",
    getList:undefined,

    init:function (func) {
      this.getList = func;
      return this;
    },

    render:function (totalSize) {
      // console.log(totalSize);
      this.totalSize = totalSize;
    },

    sizeChangeHandler:function(val) {
      this.pageSize = val;
      if(this.getList && this.getList instanceof Function){
        this.getList();
      }
    },
    currentChangeHandler:function(){
      // console.log(this.curPage);
      if(this.getList && this.getList instanceof Function){
        this.getList();
      }
    },
    getPage:function () {
      return {
        curPage:this.curPage,
        pageSize:this.pageSize
      };
    }

  };
};



