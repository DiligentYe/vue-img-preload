(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Preload"] = factory();
	else
		root["Preload"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Preload = {
    /**
     * 定义插件的intall方法
     * @param  {object} Vue     Vue对象
     * @param  {object} options 配置项
     *      eachLoaded: 每次加载成功图片的行为
     *      allLoaded: 所有图片加载成功的行为
     *      max: 一次加载的照片个数
     *      type: 图片有序／无序加载
     */
    install: function install(Vue, options) {
        // 配置项
        var opts = {};
        // 图片数组
        var imgs = void 0;
        // 数组长度
        var len = void 0;

        /* 分段处理时使用的参数 */
        // 每一次图片地址的数量
        var partCount = void 0;
        // 每一批以处理图片个数
        var iter = void 0;
        // 是否第一批图片请求成功
        var first = void 0;

        /* 返回给用户的内部数据 */
        // 当前加载所有数据
        var total = void 0;

        // 配置默认项
        typeof options === 'undefined' ? options = {} : '';
        extents(options, Preload.DEFAULT);

        /**
         * preload整体逻辑，处理图片请求
         * @param  {DOM} el      指令绑定的DOM元素
         * @param  {object} binding 绑定指令时相关信息，包括参数，值
         * @return {[type]}         [description]
         */
        function preload(el, binding) {
            // 初始化数据
            total = 0;
            first = true;
            iter = 0;

            if (typeof binding.value === 'string') {
                imgs = [binding.value];
            } else if (Object.prototype.toString.call(binding.value) == '[object Array]') {
                imgs = binding.value.slice(0);
            } else {
                imgs = binding.value.imgs.slice(0);
                opts = binding.value.options;
            }

            len = imgs.length;

            // 合并配置项
            extents(opts, options);

            console.log(opts);

            if (opts.type === 'disorder') {
                split(imgs);
            } else {
                orderHandler(imgs);
            }

            /**
             * 处理图片有序预请求函数
             * @param  {array} imgs 图片数组地址
             * @return {[type]}      [description]
             */
            function orderHandler(imgs) {
                var img = void 0,
                    imgObj = void 0;
                if (imgs.length !== 0) {
                    img = imgs.shift();
                    imgObj = new Image();

                    imgObj.src = img;

                    imgObj.addEventListener('load', orderListener, false);

                    imgObj.addEventListener('error', orderListener, false);
                }
            }

            /**
             * 有序请求的load和error事件的事件处理函数
             * @param  {object} event 事件相关参数
             * @return {[type]}       [description]
             */
            function orderListener(event) {
                // 获取操作对象
                var imgObj = event.target;

                var msg = void 0;

                // 图片数量递增
                total++;

                // 移除所有的事件监听
                imgObj.removeEventListener('load', orderListener);
                imgObj.removeEventListener('error', orderListener);

                // 执行加载完成后的动作, 将图片加载的数量和event参数传递出去
                msg = {};
                msg.total = total;
                msg.events = event;

                console.log(msg);

                opts.eachLoaded(msg);

                // 所有图片下载完毕
                if (total === len) {
                    opts.allLoaded(msg);
                } else {
                    orderHandler(imgs);
                }
            }

            /**
             * 处理无序图片预加载的分片工作
             * @param  {array} imgs 图片地址
             * @return {[type]}      [description]
             */
            function split(imgs) {
                if (imgs.length < opts.max) {
                    // 如果图片个数小于设置的最大阀值，请求数组所有图片
                    disorderHandler(imgs.splice(0, imgs.length));
                } else {
                    // 如果图片个数大于设置的最大阀值，先请求max个图片
                    disorderHandler(imgs.splice(0, opts.max));
                }
            }

            /**
             * 处理图片无序预请求函数
             * @param  {array} imgs 图片数组地址
             * @return {[type]}      [description]
             */
            function disorderHandler(imgs) {
                partCount = imgs.length;

                imgs.forEach(function (img) {
                    var imgObj = new Image();
                    imgObj.src = img;

                    imgObj.addEventListener('load', disorderListener, false);

                    imgObj.addEventListener('error', disorderListener, false);
                });
            }

            /**
             * 无序请求的load和error事件的事件处理函数
             * @param  {object} event 事件相关参数
             * @return {[type]}       [description]
             */
            function disorderListener(event) {
                // 获取操作对象
                var imgObj = event.target;

                var msg = void 0;

                // 叠加计数
                iter++;

                // 总处理数量增加
                total++;

                // 移除所有的事件监听
                imgObj.removeEventListener('load', disorderListener);
                imgObj.removeEventListener('error', disorderListener);

                // 执行加载完成后的动作
                msg = {};
                msg.total = total;
                msg.events = event;

                opts.eachLoaded(msg);

                // 该部分图片是否请求完毕
                if (iter === partCount) {
                    iter = 0;
                    // 只在第一次片段在在完成后执行allLoaded函数
                    if (first) {
                        opts.allLoaded(msg);
                        first = false;
                    }

                    // 如果图片未完全请求完毕，继续请求剩余图片
                    if (imgs.length !== 0) {
                        split(imgs);
                    }
                }
            }
        }

        Vue.directive('preload', {
            // 绑定指令动作
            bind: function bind(el, binding, vnode, oldVnode) {
                preload(el, binding);
            },

            // 数据更新时
            update: function update(el, binding, vnode, oldVnode) {
                preload(el, binding);
            }
        });
    }
};

Preload.DEFAULT = {
    eachLoaded: function eachLoaded(msg) {
        console.log('one picture has been loaded');
    },
    allLoaded: function allLoaded(msg) {
        console.log('all picture has been loaded');
    },
    max: 1000,
    type: 'disorder'

    /**
     * 简单的对象合并函数
     * @param  {object} target [description]
     * @param  {[type]} source [description]
     * @return {[type]}        [description]
     */
};function extents(target, source) {
    for (var key in source) {
        target[key] == undefined ? target[key] = source[key] : '';
    }
}

module.exports = Preload;

/***/ })

/******/ });
});
//# sourceMappingURL=preload.js.map