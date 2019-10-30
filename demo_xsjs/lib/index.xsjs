/*eslint quotes: ["error", "single"]*/
/*eslint prefer-const: "error"*/
/*eslint-env es6 */

$.response.contentType = 'application/json';
$.response.setBody(JSON.stringify({
  message: 'Hello World'
}));
$.response.status = $.net.http.OK;