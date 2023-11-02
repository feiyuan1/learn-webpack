"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunklearn_webpack"] = self["webpackChunklearn_webpack"] || []).push([["index"],{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"./node_modules/lodash/lodash.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _print__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./print */ \"./src/print.js\");\n\n// 怎么省略后缀名来着？\n\n// import iconUrl from \"./icon.png\"\n// 样式定义打包后被放在了 style 标签中\n// import \"./style.css\"\n\nfunction createButton() {\n  const button = document.createElement(\"button\")\n  button.innerHTML = \"click me and check the console\"\n  button.onclick = _print__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n  return button\n}\n\nfunction component() {\n  const element = document.createElement(\"div\")\n  const button = createButton()\n  // lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的\n  element.innerHTML = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.join)([\"Hello\", \"webpack\"], \" \")\n  // 插入图片\n  // const icon = new Image()\n  // icon.src = iconUrl\n  // icon.alt = \"\"\n  // icon.width = 100\n  // element.appendChild(icon)\n  // element.classList.add(\"red\")\n  element.appendChild(button)\n  return element\n}\n\ndocument.body.appendChild(component())\n\n\n//# sourceURL=webpack://learn-webpack/./src/index.js?");

/***/ }),

/***/ "./src/print.js":
/*!**********************!*\
  !*** ./src/print.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ print)\n/* harmony export */ });\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"./node_modules/lodash/lodash.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\n// 重复引用同一个依赖 lodash\n\n\nconsole.log(lodash__WEBPACK_IMPORTED_MODULE_0___default().join([\"Another\", \"module\", \"loaded!\"], \" \"))\n\nfunction print() {\n  console.log(\"I get called from print.js\")\n}\n\n\n//# sourceURL=webpack://learn-webpack/./src/print.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["shared"], () => (__webpack_exec__("./src/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);