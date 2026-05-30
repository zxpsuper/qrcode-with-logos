'use strict';

var QRCode = require('qrcode');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var QRCode__default = /*#__PURE__*/_interopDefaultLegacy(QRCode);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Normalize hex color strings: auto-prepend '#' if missing.
 * Handles 3/4/6/8 digit hex (e.g. 'fff', 'ffff', 'ffffff', 'ffffffff').
 * Non-hex strings (rgb, named colors, etc.) are returned unchanged.
 * @param color
 * @returns
 */
function normalizeColor(color) {
    if (!color)
        return color;
    if (color.charAt(0) === '#')
        return color;
    if (/^[0-9a-fA-F]{3,4}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(color)) {
        return '#' + color;
    }
    return color;
}
// 對於内容少的qrcode，增大容錯率
// Increase the fault tolerance for QrCode with less content
function getErrorCorrectionLevel(content) {
    if (content.length > 36) {
        return 'M';
    }
    else if (content.length > 16) {
        return 'Q';
    }
    else {
        return 'H';
    }
}
/**
 * load image, resolve image
 * 加載圖片
 * @param logoSrc
 * @param crossOrigin
 * @returns
 */
function loadImage(logoSrc, crossOrigin) {
    return new Promise(function (resolve, reject) {
        var image = new Image();
        // Set onload/onerror before setting src to ensure they're registered
        image.onload = function () {
            resolve(image);
        };
        image.onerror = function () {
            reject('logo load fail!');
        };
        if (crossOrigin) {
            image.setAttribute('crossOrigin', crossOrigin);
        }
        else {
            image.setAttribute('crossOrigin', 'anonymous');
        }
        image.src = logoSrc;
    });
}
/**
 * draw radius
 * 繪製帶圓角的綫條
 * @param ctx
 * @returns
 */
var canvasRoundRect = function (ctx) {
    return function (x, y, w, h, r) {
        var minSize = Math.min(w, h);
        if (r > minSize / 2) {
            r = minSize / 2;
        }
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        return ctx;
    };
};
/**
 * 判斷是否是函數
 * Determine if it is a function
 * @param o {function} 函數
 */
function isFunction(o) {
    return typeof o === 'function';
}
/**
 * canvas get base64 url and set image src value, if need download image, auto download image
 * 獲取 canvas base64 並賦值給 image 的 src 屬性
 * @param options
 * @returns
 */
var toImage = function (options) {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, image, download, downloadName, dataURL, startDownload;
        return __generator(this, function (_a) {
            canvas = options.canvas, image = options.image, download = options.download, downloadName = options.downloadName;
            if (!canvas) {
                throw new Error('Canvas element is required');
            }
            dataURL = canvas.toDataURL();
            if (dataURL) {
                image.src = dataURL;
            }
            else {
                throw new Error('Can not get the canvas DataURL');
            }
            if (download !== true && !isFunction(download)) {
                return [2 /*return*/];
            }
            startDownload = function () {
                return saveImage(image, downloadName);
            };
            if (download === true) {
                return [2 /*return*/, startDownload()];
            }
            if (isFunction(download)) {
                return [2 /*return*/, download(startDownload)];
            }
            return [2 /*return*/, Promise.resolve()];
        });
    });
};
/**
 * save image 保存圖片
 * @param image HTMLImageElement
 * @param name image name
 * @returns
 */
var saveImage = function (image, name) {
    return new Promise(function (resolve, reject) {
        try {
            var dataURL = image.src;
            var link = document.createElement('a');
            link.download = name;
            link.href = dataURL;
            document.body.appendChild(link);
            link.dispatchEvent(new MouseEvent('click'));
            document.body.removeChild(link);
            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
};

var QRDot = /** @class */ (function () {
    function QRDot(options) {
        var _this = this;
        this.drawMethodMap = {
            'tile': function (args) { return _this._drawTile(args); },
            'dot': function (args) { return _this._drawDot(args); },
            'dot-small': function (args) { return _this._drawDotSmall(args); },
            'rounded': function (args) { return _this._drawRounded(args); },
            'square': function (args) { return _this._drawSquare(args); },
            'diamond': function (args) { return _this._drawDiamond(args); },
            'star': function (args) { return _this._drawStar(args); },
            'fluid': function (args) { return _this._drawFluid(args); },
            'fluid-line': function (args) { return _this._drawFluidLine(args); },
            'stripe': function (args) { return _this._drawStripe(args); },
            'stripe-row': function (args) { return _this._drawStripeRow(args); },
            'stripe-column': function (args) { return _this._drawStripeColumn(args); }
        };
        this._context = options.context;
        this._type = options.type;
        this.dotSize = options.dotSize;
    }
    QRDot.prototype.draw = function (x, y, getNeighbor, qrCanvas, i, j) {
        var drawFunction = this.drawMethodMap[this._type] || this.drawMethodMap['square'];
        drawFunction({
            x: x,
            y: y,
            size: this.dotSize,
            context: this._context,
            getNeighbor: getNeighbor,
            qrCanvas: qrCanvas,
            i: i,
            j: j
        });
    };
    QRDot.prototype._drawSquare = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context;
        this._basicSquare({ x: x, y: y, size: size, context: context, rotation: 0 });
    };
    QRDot.prototype._basicSquare = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.rect(-size / 2, -size / 2, size, size);
            } }));
    };
    QRDot.prototype._drawDot = function (args) {
        this._drawBasicDot(args);
    };
    QRDot.prototype._drawDotSmall = function (args) {
        this._drawBasicDot(__assign(__assign({}, args), { dotRate: 0.3 }));
    };
    QRDot.prototype._drawBasicDot = function (args) {
        var x = args.x, y = args.y, size = args.size, context = args.context, _a = args.dotRate, dotRate = _a === void 0 ? 0.4 : _a;
        var cx = x + size / 2;
        var cy = y + size / 2;
        context.save();
        context.beginPath();
        context.arc(cx, cy, size * dotRate, 0, Math.PI * 2);
        context.closePath();
        context.fill();
        context.restore();
    };
    QRDot.prototype._drawRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context;
        size = 0.75 * size;
        x += (1 / 8) * size;
        y += (1 / 8) * size;
        var cx = x + size / 2;
        var cy = y + size / 2;
        var originX = -size / 2;
        context.save();
        context.translate(cx, cy);
        canvasRoundRect(context)(originX, originX, size, size, size / 4);
        context.fill();
        context.restore();
    };
    QRDot.prototype._drawTile = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.rect(-size / 2, -size / 2, size - 1, size - 1);
            } }));
    };
    QRDot.prototype._drawDiamond = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { rotation: Math.PI / 4, draw: function () {
                size = (0.5 * size) / Math.sin(Math.PI / 4);
                context.rect(-size / 2, -size / 2, size, size);
            } }));
    };
    QRDot.prototype._drawStar = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { rotation: Math.PI / 4, draw: function () {
                context.moveTo(-size / 2, -size / 2);
                context.quadraticCurveTo(0, 0, size / 2, -size / 2);
                context.quadraticCurveTo(0, 0, size / 2, size / 2);
                context.quadraticCurveTo(0, 0, -size / 2, size / 2);
                context.quadraticCurveTo(0, 0, -size / 2, -size / 2);
            } }));
    };
    QRDot.prototype._drawFluidLine = function (args) {
        this._drawFluid(args, true);
    };
    QRDot.prototype._drawFluid = function (_a, line) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, getNeighbor = _a.getNeighbor;
        if (line === void 0) { line = false; }
        var roundedCorners = [false, false, false, false]; // top-left, top-right, bottom-right, bottom-left
        if (!getNeighbor(0, -1) && !getNeighbor(-1, 0))
            roundedCorners[0] = true;
        if (!getNeighbor(1, 0) && !getNeighbor(0, -1))
            roundedCorners[1] = true;
        if (!getNeighbor(0, 1) && !getNeighbor(1, 0))
            roundedCorners[2] = true;
        if (!getNeighbor(0, 1) && !getNeighbor(-1, 0))
            roundedCorners[3] = true;
        var cx = x + size / 2;
        var cy = y + size / 2;
        context.save();
        context.translate(cx, cy);
        context.beginPath();
        context.arc(0, 0, size / 2, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
        if (!roundedCorners[0])
            context.fillRect(-size / 2, -size / 2, size / 2, size / 2);
        if (!roundedCorners[1])
            context.fillRect(0, -size / 2, size / 2, size / 2);
        if (!roundedCorners[2])
            context.fillRect(0, 0, size / 2, size / 2);
        if (!roundedCorners[3])
            context.fillRect(-size / 2, 0, size / 2, size / 2);
        if (line && !getNeighbor(0, 1)) {
            if (getNeighbor(-1, 1)) {
                context.beginPath();
                context.arc(-size, 0, size / 2, 0, 0.5 * Math.PI, false);
                context.arc(0, size, size / 2, Math.PI, 1.5 * Math.PI, false);
                context.closePath();
                context.stroke();
                context.fill();
            }
            if (getNeighbor(1, 1)) {
                context.beginPath();
                context.arc(size, 0, size / 2, 0.5 * Math.PI, Math.PI, false);
                context.arc(0, size, size / 2, 1.5 * Math.PI, 0, false);
                context.closePath();
                context.stroke();
                context.fill();
            }
        }
        context.restore();
    };
    QRDot.prototype._drawStripeColumn = function (args) {
        return this._drawStripe(args, 'column');
    };
    QRDot.prototype._drawStripeRow = function (args) {
        return this._drawStripe(args, 'row');
    };
    QRDot.prototype._drawStripe = function (_a, type) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, qrCanvas = _a.qrCanvas, i = _a.i, j = _a.j;
        if (type === void 0) { type = 'default'; }
        var setRangeDisabled = function (width, height) {
            for (var i1 = i; i1 < i + width; i1++) {
                for (var j1 = j; j1 < j + height; j1++) {
                    qrCanvas.setDisabled(i1, j1);
                }
            }
        };
        var getRangeTrue = function (width, height) {
            for (var i1 = i; i1 < i + width; i1++) {
                for (var j1 = j; j1 < j + height; j1++) {
                    if (!qrCanvas.isDark(i1, j1)) {
                        return false;
                    }
                }
            }
            return true;
        };
        var drawItem = function (width, height) {
            var cx = x + size / 2;
            var cy = y + size / 2;
            context.save();
            context.translate(cx, cy);
            context.beginPath();
            if (width === 1 && height === 1) {
                // 画圆点
                context.arc(0, 0, size / 4, 0, 2 * Math.PI, false);
            }
            else if (width > 1) {
                // 画横
                context.arc(0, 0, size / 4, 0.5 * Math.PI, 1.5 * Math.PI, false);
                context.arc(size * (width - 1), 0, size / 4, 1.5 * Math.PI, 0.5 * Math.PI, false);
            }
            else if (height > 1) {
                // 画竖
                context.arc(0, 0, size / 4, Math.PI, 2 * Math.PI, false);
                context.arc(0, size * (height - 1), size / 4, 0, Math.PI, false);
            }
            context.fill();
            context.closePath();
            context.restore();
            setRangeDisabled(width, height);
        };
        var array = type === 'row'
            ? [
                [3, 1],
                [2, 1],
                [1, 1]
            ]
            : type === 'column'
                ? [
                    [1, 3],
                    [1, 2],
                    [1, 1]
                ]
                : [
                    [3, 1],
                    [1, 3],
                    [2, 1],
                    [1, 2],
                    [1, 1]
                ];
        array.forEach(function (comb) {
            if (getRangeTrue(comb[0], comb[1])) {
                drawItem(comb[0], comb[1]);
            }
        });
    };
    QRDot.prototype._rotateFigure = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, _b = _a.rotation, rotation = _b === void 0 ? 0 : _b, draw = _a.draw;
        var cx = x + size / 2;
        var cy = y + size / 2;
        context.save();
        context.translate(cx, cy);
        if (rotation)
            context.rotate(rotation);
        draw();
        context.closePath();
        context.restore();
    };
    return QRDot;
}());

var QRCorner = /** @class */ (function () {
    function QRCorner(context, cornerType, color) {
        var _this = this;
        this.drawMethodMap = {
            'square': function (args) { return _this._drawSquare(args); },
            'rounded': function (args) { return _this._drawRounded(args); },
            'circle': function (args) { return _this._drawCircle(args); },
            'rounded-circle': function (args) { return _this._drawRoundedCircle(args); },
            'circle-rounded': function (args) { return _this._drawCircleRounded(args); },
            'circle-diamond': function (args) { return _this._drawCircleDiamond(args); },
            'circle-star': function (args) { return _this._drawCircleStar(args); }
        };
        this.context = context;
        this.cornerType = cornerType;
        this.color = color;
    }
    QRCorner.prototype.draw = function (_a) {
        var radius = _a.radius, x = _a.x, y = _a.y, dotSize = _a.dotSize;
        var drawFunction = this.drawMethodMap[this.cornerType] || this.drawMethodMap['square'];
        drawFunction({ x: x, y: y, radius: radius, dotSize: dotSize });
    };
    QRCorner.prototype._drawRoundedCircle = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize, radius = _a.radius;
        var _radius = typeof radius === 'number' ? radius : (radius === null || radius === void 0 ? void 0 : radius.outer) || dotSize / 2;
        this.drawRoundedSquare(dotSize, x, y, dotSize * 7, _radius, false, 0);
        this.drawCircle(dotSize, x + 2 * dotSize, y + 2 * dotSize, dotSize * 3, true);
    };
    QRCorner.prototype._drawCircleRounded = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize, radius = _a.radius;
        this.drawCircle(dotSize, x, y, dotSize * 7, false);
        var _radius = typeof radius === 'number' ? radius : (radius === null || radius === void 0 ? void 0 : radius.inner) || dotSize / 4;
        this.drawRoundedSquare(dotSize, x + 2 * dotSize, y + 2 * dotSize, dotSize * 3, _radius, true, 0);
    };
    QRCorner.prototype._drawCircleDiamond = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize;
        this.drawCircle(dotSize, x, y, dotSize * 7, false);
        this.drawRoundedSquare(dotSize, x + 2 * dotSize, y + 2 * dotSize, dotSize * 3, 0, true, (45 * Math.PI) / 180);
    };
    QRCorner.prototype._drawCircleStar = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize;
        this.drawCircle(dotSize, x, y, dotSize * 7, false);
        this.drawInnerStar(x + 2 * dotSize, y + 2 * dotSize, dotSize * 3);
    };
    QRCorner.prototype._drawSquare = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize;
        return this._drawBasicRounded({ x: x, y: y, dotSize: dotSize, radius: 0 });
    };
    QRCorner.prototype._drawRounded = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize, radius = _a.radius;
        var inner = typeof radius === 'number' ? radius : (radius === null || radius === void 0 ? void 0 : radius.inner) || dotSize / 4;
        var outer = typeof radius === 'number' ? radius : (radius === null || radius === void 0 ? void 0 : radius.outer) || dotSize / 2;
        return this._drawBasicRounded({
            x: x,
            y: y,
            dotSize: dotSize,
            radius: {
                inner: inner,
                outer: outer
            }
        });
    };
    QRCorner.prototype._drawCircle = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize;
        this.drawCircle(dotSize, x, y, dotSize * 7, false);
        this.drawCircle(dotSize, x + 2 * dotSize, y + 2 * dotSize, dotSize * 3, true);
    };
    QRCorner.prototype._drawBasicRounded = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize, radius = _a.radius, _b = _a.rotation, rotation = _b === void 0 ? 0 : _b;
        var radiusOuter;
        var radiusInner;
        if (typeof radius !== 'number') {
            radiusOuter = radius.outer || 0;
            radiusInner = radius.inner || 0;
        }
        else {
            radiusOuter = radius;
            radiusInner = radiusOuter;
        }
        var size = dotSize * 7;
        // Outer box
        this.drawRoundedSquare(dotSize, x, y, size, radiusOuter, false, rotation);
        // Inner box
        size = dotSize * 3;
        y += dotSize * 2;
        x += dotSize * 2;
        this.drawRoundedSquare(dotSize, x, y, size, radiusInner, true, rotation);
    };
    QRCorner.prototype.drawCircle = function (dotSize, x, y, size, fill) {
        var ctx = this.context;
        var color = this.color;
        ctx.save();
        ctx.lineWidth = dotSize;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        y += size / 2;
        x += size / 2;
        size -= dotSize;
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        ctx.restore();
    };
    QRCorner.prototype.drawRoundedSquare = function (dotSize, x, y, size, radius, fill, rotation) {
        var ctx = this.context;
        var color = this.color;
        ctx.save();
        ctx.lineWidth = dotSize;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        // Adjust coordinates so that the outside of the stroke is aligned to the edges
        y += dotSize / 2;
        x += dotSize / 2;
        size -= dotSize;
        if (!Array.isArray(radius)) {
            radius = [radius, radius, radius, radius];
        }
        // Radius should not be greater than half the size or less than zero
        radius = radius.map(function (r) {
            r = Math.min(r, size / 2);
            return r < 0 ? 0 : r;
        });
        var rTopLeft = radius[0] || 0;
        var rTopRight = radius[1] || 0;
        var rBottomRight = radius[2] || 0;
        var rBottomLeft = radius[3] || 0;
        ctx.beginPath();
        var cx = x + size / 2;
        var cy = y + size / 2;
        var originX = -size / 2;
        ctx.translate(cx, cy);
        if (rotation)
            ctx.rotate(rotation);
        ctx.moveTo(originX + rTopLeft, originX);
        ctx.lineTo(originX + size - rTopRight, originX);
        if (rTopRight)
            ctx.quadraticCurveTo(originX + size, originX, originX + size, originX + rTopRight);
        ctx.lineTo(originX + size, originX + size - rBottomRight);
        if (rBottomRight)
            ctx.quadraticCurveTo(originX + size, originX + size, originX + size - rBottomRight, originX + size);
        ctx.lineTo(originX + rBottomLeft, originX + size);
        if (rBottomLeft)
            ctx.quadraticCurveTo(originX, originX + size, originX, originX + size - rBottomLeft);
        ctx.lineTo(originX, originX + rTopLeft);
        if (rTopLeft)
            ctx.quadraticCurveTo(originX, originX, originX + rTopLeft, originX);
        ctx.closePath();
        ctx.stroke();
        if (fill) {
            ctx.fill();
        }
        ctx.restore();
    };
    QRCorner.prototype.drawInnerStar = function (x, y, size) {
        var context = this.context;
        var cx = x + size / 2;
        var cy = y + size / 2;
        context.save();
        context.translate(cx, cy);
        context.beginPath();
        context.moveTo(-size / 2, -size / 2);
        context.quadraticCurveTo(0, -size / 4, size / 2, -size / 2);
        context.quadraticCurveTo(size / 4, 0, size / 2, size / 2);
        context.quadraticCurveTo(0, size / 4, -size / 2, size / 2);
        context.quadraticCurveTo(-size / 4, 0, -size / 2, -size / 2);
        context.closePath();
        context.fill();
        context.restore();
    };
    return QRCorner;
}());

var defaultOptions = {
    logo: {
        bgColor: '#fff',
        borderWidth: 10,
        crossOrigin: 'anonymous',
        borderRadius: 8,
        logoRadius: 0
    },
    width: 380,
    download: false,
    downloadName: 'qr-code.png',
    nodeQrCodeOptions: {
        margin: 4,
        color: {
            dark: '#000',
            light: '#fff'
        }
    },
    dotsOptions: {
        type: 'square',
        color: '#000'
    },
    cornersOptions: {
        type: 'square',
        color: '#000'
    },
    renderer: 'canvas'
};

var squareMask$1 = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];
var dotMask$1 = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];
var ErrorCorrectionPercents$1 = {
    L: 0.07,
    M: 0.15,
    Q: 0.25,
    H: 0.3
};
var QRCanvas = /** @class */ (function () {
    function QRCanvas(options) {
        this.qrcodeArray = [];
        /**dotSize: Integer */
        this.dotSize = 0;
        /**offset: Integer */
        this.offset = 0;
        var canvas = options.canvas, content = options.content, _a = options.width, width = _a === void 0 ? defaultOptions.width : _a, _b = options.nodeQrCodeOptions, nodeQrCodeOptions = _b === void 0 ? {} : _b;
        // 默認對内容少的二維碼采用高容錯率，内容多的二維碼采用低容錯率
        // according to the content length to choose different errorCorrectionLevel
        nodeQrCodeOptions.errorCorrectionLevel =
            nodeQrCodeOptions.errorCorrectionLevel || getErrorCorrectionLevel(content);
        var QRDATA = QRCode__default["default"].create(content, nodeQrCodeOptions);
        this.canvas = canvas;
        this.options = options;
        this.canvas.setAttribute('width', width + '');
        this.canvas.setAttribute('height', width + '');
        this.saveQRData(QRDATA);
    }
    /**
     * clear canvas 清理畫布
     */
    QRCanvas.prototype.clear = function () {
        var canvasContext = this.context;
        if (canvasContext) {
            canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    };
    Object.defineProperty(QRCanvas.prototype, "context", {
        get: function () {
            return this.canvas.getContext('2d');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 保存qrcode原始數據
     * @param QRDATA
     */
    QRCanvas.prototype.saveQRData = function (QRDATA) {
        var _a;
        this.size = QRDATA.modules.size;
        this.version = QRDATA.version;
        this.qrcodeArray = QRDATA.modules.data;
        var nodeQrCodeOptions = this.options.nodeQrCodeOptions;
        var margin = (nodeQrCodeOptions === null || nodeQrCodeOptions === void 0 ? void 0 : nodeQrCodeOptions.margin) || defaultOptions.nodeQrCodeOptions.margin;
        var count = this.size;
        var width = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.width) || defaultOptions.width;
        /**
         * 二維碼去除 margin 后的實際寬度
         */
        var withoutMarginSize = width - margin * 2;
        /**每个像素点宽度 */
        this.dotSize = Math.floor(withoutMarginSize / count);
        this.offset = Math.floor((width - count * this.dotSize) / 2);
    };
    /**初始化 */
    QRCanvas.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var drawFunction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.clear();
                        this.drawBackground();
                        return [4 /*yield*/, this.drawLogo()];
                    case 1:
                        drawFunction = _a.sent();
                        this.drawDots();
                        this.drawCorners();
                        drawFunction && drawFunction.call(this);
                        return [2 /*return*/];
                }
            });
        });
    };
    QRCanvas.prototype.drawLogo = function () {
        var _a;
        var logo = (_a = this.options) === null || _a === void 0 ? void 0 : _a.logo;
        if (logo) {
            if (typeof logo === 'string') {
                logo = { src: logo };
            }
            return this._drawLogo(logo);
        }
        else {
            return Promise.resolve(null);
        }
    };
    QRCanvas.prototype._drawLogo = function (logo) {
        return __awaiter(this, void 0, void 0, function () {
            var context, canvas, coverLevel, maxHiddenDots, src, _a, bgColor, _b, borderWidth, _c, crossOrigin, _d, borderRadius, _e, logoRadius, image, rate, logoWidth, logoHeight, logoInnerWidth, logoInnerHeight, maxHeight, xStart, xEnd, yStart, yEnd;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        context = this.context;
                        canvas = this.canvas;
                        coverLevel = ErrorCorrectionPercents$1[this.options.nodeQrCodeOptions.errorCorrectionLevel];
                        maxHiddenDots = Math.floor(coverLevel * coverLevel * this.size * this.size);
                        src = logo.src, _a = logo.bgColor, bgColor = _a === void 0 ? defaultOptions.logo.bgColor : _a, _b = logo.borderWidth, borderWidth = _b === void 0 ? defaultOptions.logo.borderWidth : _b, _c = logo.crossOrigin, crossOrigin = _c === void 0 ? defaultOptions.logo.crossOrigin : _c, _d = logo.borderRadius, borderRadius = _d === void 0 ? defaultOptions.logo.borderRadius : _d, _e = logo.logoRadius, logoRadius = _e === void 0 ? defaultOptions.logo.logoRadius : _e;
                        return [4 /*yield*/, loadImage(src, crossOrigin)];
                    case 1:
                        image = _f.sent();
                        rate = image.width / image.height;
                        maxHeight = Math.floor(Math.sqrt((this.dotSize * this.dotSize * maxHiddenDots) / rate));
                        if (rate > 1) {
                            logoHeight = maxHeight;
                            logoInnerHeight = maxHeight - 2 * borderWidth;
                            logoInnerWidth = Math.floor(logoInnerHeight * rate);
                            logoWidth = logoInnerWidth + borderWidth * 2;
                        }
                        else {
                            logoWidth = Math.floor(maxHeight * rate);
                            logoInnerWidth = logoWidth - borderWidth * 2;
                            logoInnerHeight = Math.floor(logoInnerWidth / rate);
                            logoHeight = logoInnerHeight + 2 * borderWidth;
                        }
                        xStart = (this.size - Math.ceil(logoWidth / this.dotSize)) / 2;
                        xEnd = this.size - xStart - 1;
                        yStart = (this.size - Math.ceil(logoHeight / this.dotSize)) / 2;
                        yEnd = this.size - yStart - 1;
                        this.inLogoRange = function (i, j) {
                            return i >= xStart && i <= xEnd && j >= yStart && j <= yEnd;
                        };
                        return [2 /*return*/, function () {
                                var cx = canvas.width / 2;
                                var cy = canvas.height / 2;
                                context.translate(cx, cy);
                                canvasRoundRect(context)(-logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight, borderRadius);
                                this.context.fillStyle = normalizeColor(bgColor);
                                this.context.fill();
                                // 使用image绘制可以避免某些跨域情况
                                // Use image drawing to avoid some cross-domain situations
                                var drawLogoWithImage = function () {
                                    context.drawImage(image, -logoInnerWidth / 2, -logoInnerHeight / 2, logoInnerWidth, logoInnerHeight);
                                };
                                // 使用canvas绘制以获得更多的功能
                                // Use canvas to draw more features, such as borderRadius
                                var drawLogoWithCanvas = function () {
                                    var canvasImage = document.createElement('canvas');
                                    canvasImage.width = logoInnerWidth;
                                    canvasImage.height = logoInnerHeight;
                                    canvasImage
                                        .getContext('2d')
                                        .drawImage(image, 0, 0, logoInnerWidth, logoInnerHeight);
                                    canvasRoundRect(context)(0, 0, logoInnerWidth, logoInnerHeight, logoRadius);
                                    // @ts-ignore
                                    context.fillStyle = context.createPattern(canvasImage, 'no-repeat');
                                    context.fill();
                                };
                                if (logoRadius) {
                                    context.translate(-logoInnerWidth / 2, -logoInnerHeight / 2);
                                    drawLogoWithCanvas();
                                    context.translate(-cx + logoInnerWidth / 2, -cy + logoInnerHeight / 2);
                                }
                                else {
                                    drawLogoWithImage();
                                    context.translate(-cx, -cy);
                                }
                            }];
                }
            });
        });
    };
    /**
     * 目標坐標是否為黑點？
     * Coordinate is dark dot ? 0 or 1
     */
    QRCanvas.prototype.isDark = function (x, y) {
        return this.qrcodeArray[x + y * this.size] === 1;
    };
    QRCanvas.prototype.isDisabled = function (x, y) {
        return this.qrcodeArray[x + y * this.size] === 2;
    };
    QRCanvas.prototype.setDisabled = function (x, y) {
        return this.qrcodeArray[x + y * this.size] = 2;
    };
    /**
     * 畫背景
     */
    QRCanvas.prototype.drawBackground = function () {
        var _a;
        var canvasContext = this.context;
        var nodeQrCodeOptions = this.options.nodeQrCodeOptions;
        var light = ((_a = nodeQrCodeOptions === null || nodeQrCodeOptions === void 0 ? void 0 : nodeQrCodeOptions.color) === null || _a === void 0 ? void 0 : _a.light) ||
            defaultOptions.nodeQrCodeOptions.color.light;
        if (canvasContext) {
            canvasContext.fillStyle = normalizeColor(light);
            canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    };
    /**
     * 画点
     */
    QRCanvas.prototype.drawDots = function () {
        var _this = this;
        var _a, _b, _c, _d;
        var canvasContext = this.context;
        if (canvasContext) {
            var count_1 = this.size;
            /**每个像素点宽度,整數 */
            var dotSize = this.dotSize;
            /**二维码起始位置x */
            var xBeginning = this.offset;
            /**二维码起始位置y */
            var yBeginning = this.offset;
            /**排除定位点 */
            var filterDots_1 = function (i, j) {
                var _a, _b, _c, _d, _e, _f;
                // 排除定位点外框
                if (((_a = squareMask$1[i]) === null || _a === void 0 ? void 0 : _a[j]) ||
                    ((_b = squareMask$1[i - count_1 + 7]) === null || _b === void 0 ? void 0 : _b[j]) ||
                    ((_c = squareMask$1[i]) === null || _c === void 0 ? void 0 : _c[j - count_1 + 7])) {
                    return false;
                }
                // 排除定位点
                if (((_d = dotMask$1[i]) === null || _d === void 0 ? void 0 : _d[j]) ||
                    ((_e = dotMask$1[i - count_1 + 7]) === null || _e === void 0 ? void 0 : _e[j]) ||
                    ((_f = dotMask$1[i]) === null || _f === void 0 ? void 0 : _f[j - count_1 + 7])) {
                    return false;
                }
                if (_this.inLogoRange && _this.inLogoRange(i, j))
                    return false;
                return true;
            };
            var dot = new QRDot({
                context: this.context,
                type: ((_a = this.options.dotsOptions) === null || _a === void 0 ? void 0 : _a.type) || defaultOptions.dotsOptions.type,
                dotSize: dotSize
            });
            canvasContext.fillStyle = canvasContext.strokeStyle = normalizeColor(((_b = this.options.dotsOptions) === null || _b === void 0 ? void 0 : _b.color) ||
                ((_d = (_c = this.options.nodeQrCodeOptions) === null || _c === void 0 ? void 0 : _c.color) === null || _d === void 0 ? void 0 : _d.dark) ||
                defaultOptions.dotsOptions.color);
            var _loop_1 = function (i) {
                var _loop_2 = function (j) {
                    if (!filterDots_1(i, j)) {
                        return "continue";
                    }
                    if (!this_1.isDark(i, j)) {
                        return "continue";
                    }
                    dot.draw(xBeginning + i * dotSize, yBeginning + j * dotSize, function (xOffset, yOffset) {
                        if (i + xOffset < 0 ||
                            j + yOffset < 0 ||
                            i + xOffset >= count_1 ||
                            j + yOffset >= count_1)
                            return null;
                        if (!filterDots_1(i + xOffset, j + yOffset))
                            return null;
                        return _this.isDark(i + xOffset, j + yOffset);
                    }, this_1, i, j);
                };
                for (var j = 0; j < count_1; j++) {
                    _loop_2(j);
                }
            };
            var this_1 = this;
            for (var i = 0; i < count_1; i++) {
                _loop_1(i);
            }
            canvasContext.fill();
        }
    };
    /**
     * 绘制角落定位图案
     */
    QRCanvas.prototype.drawCorners = function () {
        var _this = this;
        var canvasContext = this.context;
        if (canvasContext) {
            var nodeQrCodeOptions_1 = this.options.nodeQrCodeOptions;
            var count_2 = this.size;
            var dotSize_1 = this.dotSize;
            var xBeginning_1 = this.offset;
            var yBeginning_1 = this.offset;
            [
                [0, 0],
                [1, 0],
                [0, 1]
            ].forEach(function (_a) {
                var _b;
                var _c = __read(_a, 2), column = _c[0], row = _c[1];
                var x = xBeginning_1 + column * dotSize_1 * (count_2 - 7);
                var y = yBeginning_1 + row * dotSize_1 * (count_2 - 7);
                var cornersOptions = _this.options.cornersOptions;
                var corner = new QRCorner(_this.context, cornersOptions.type || defaultOptions.cornersOptions.type, normalizeColor(cornersOptions.color ||
                    ((_b = nodeQrCodeOptions_1 === null || nodeQrCodeOptions_1 === void 0 ? void 0 : nodeQrCodeOptions_1.color) === null || _b === void 0 ? void 0 : _b.dark) ||
                    defaultOptions.cornersOptions.color));
                corner.draw({
                    x: x,
                    y: y,
                    dotSize: dotSize_1,
                    radius: cornersOptions.radius
                });
            });
        }
    };
    return QRCanvas;
}());

/**
 * SVG helper functions for building SVG QR code markup.
 * All functions return SVG markup strings — no external dependencies.
 */
/**
 * Wrap body content in a complete <svg> tag.
 */
function wrapSvg(body, width) {
    return ("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ".concat(width, " ").concat(width, "\" width=\"").concat(width, "\" height=\"").concat(width, "\">") +
        body +
        '</svg>');
}
/**
 * Build a <rect> element.
 */
function svgRect(x, y, w, h, attrs) {
    if (attrs === void 0) { attrs = {}; }
    var extra = attrs ? ' ' + attrString(attrs) : '';
    return "<rect x=\"".concat(fmt(x), "\" y=\"").concat(fmt(y), "\" width=\"").concat(fmt(w), "\" height=\"").concat(fmt(h), "\"").concat(extra, "/>");
}
/**
 * Build a <circle> element.
 */
function svgCircle(cx, cy, r, attrs) {
    if (attrs === void 0) { attrs = {}; }
    var extra = attrs ? ' ' + attrString(attrs) : '';
    return "<circle cx=\"".concat(fmt(cx), "\" cy=\"").concat(fmt(cy), "\" r=\"").concat(fmt(r), "\"").concat(extra, "/>");
}
/**
 * Build a <path> element with the given `d` attribute and extra attrs.
 */
function svgPath(d, attrs) {
    if (attrs === void 0) { attrs = {}; }
    var extra = attrs ? ' ' + attrString(attrs) : '';
    return "<path d=\"".concat(d, "\"").concat(extra, "/>");
}
/**
 * Build a <g> (group) element wrapping children.
 */
function svgGroup(children, attrs) {
    if (attrs === void 0) { attrs = {}; }
    var extra = attrs ? ' ' + attrString(attrs) : '';
    return "<g".concat(extra, ">").concat(children, "</g>");
}
/**
 * Build a rounded-rectangle path `d` attribute string.
 * Supports different radii per corner: [tl, tr, br, bl]
 */
function roundRectPath(x, y, w, h, radii) {
    var r = radii.map(function (v) { return Math.min(v, Math.min(w, h) / 2); });
    var _a = __read(r, 4), tl = _a[0], tr = _a[1], br = _a[2], bl = _a[3];
    var X = fmt;
    var Y = fmt;
    return ("M".concat(X(x + tl), " ").concat(Y(y)) +
        "L".concat(X(x + w - tr), " ").concat(Y(y)) +
        (tr ? "A".concat(X(tr), " ").concat(Y(tr), " 0 0 1 ").concat(X(x + w), " ").concat(Y(y + tr)) : '') +
        "L".concat(X(x + w), " ").concat(Y(y + h - br)) +
        (br ? "A".concat(X(br), " ").concat(Y(br), " 0 0 1 ").concat(X(x + w - br), " ").concat(Y(y + h)) : '') +
        "L".concat(X(x + bl), " ").concat(Y(y + h)) +
        (bl ? "A".concat(X(bl), " ").concat(Y(bl), " 0 0 1 ").concat(X(x), " ").concat(Y(y + h - bl)) : '') +
        "L".concat(X(x), " ").concat(Y(y + tl)) +
        (tl ? "A".concat(X(tl), " ").concat(Y(tl), " 0 0 1 ").concat(X(x + tl), " ").concat(Y(y)) : '') +
        'Z');
}
// ---- Internal helpers ----
function attrString(attrs) {
    return Object.entries(attrs)
        .map(function (_a) {
        var _b = __read(_a, 2), k = _b[0], v = _b[1];
        return "".concat(k, "=\"").concat(v, "\"");
    })
        .join(' ');
}
/**
 * Format number: drop trailing zeros for compact SVG output.
 */
function fmt(n) {
    // Keep 2 decimal places max, strip trailing zeros
    var s = n.toFixed(2);
    return s.replace(/\.?0+$/, '');
}

var SvgDot = /** @class */ (function () {
    function SvgDot(options) {
        var _this = this;
        this.drawMethodMap = {
            tile: function (args) { return _this._drawTile(args); },
            dot: function (args) { return _this._drawDot(args); },
            'dot-small': function (args) { return _this._drawDotSmall(args); },
            rounded: function (args) { return _this._drawRounded(args); },
            square: function (args) { return _this._drawSquare(args); },
            diamond: function (args) { return _this._drawDiamond(args); },
            star: function (args) { return _this._drawStar(args); },
            fluid: function (args) { return _this._drawFluid(args); },
            'fluid-line': function (args) { return _this._drawFluidLine(args); },
            stripe: function (args) { return _this._drawStripe(args); },
            'stripe-row': function (args) { return _this._drawStripeRow(args); },
            'stripe-column': function (args) { return _this._drawStripeColumn(args); },
        };
        this._type = options.type;
        this.dotSize = options.dotSize;
        this._color = options.color;
    }
    SvgDot.prototype.draw = function (x, y, getNeighbor, qrData, i, j) {
        var drawFunction = this.drawMethodMap[this._type] || this.drawMethodMap['square'];
        return drawFunction({
            x: x,
            y: y,
            size: this.dotSize,
            getNeighbor: getNeighbor,
            qrData: qrData,
            i: i,
            j: j,
        });
    };
    Object.defineProperty(SvgDot.prototype, "fill", {
        get: function () {
            return this._color;
        },
        enumerable: false,
        configurable: true
    });
    // ---- Square ----
    SvgDot.prototype._drawSquare = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size;
        return this._basicSquare(x, y, size, 0);
    };
    SvgDot.prototype._basicSquare = function (x, y, size, rotation) {
        var cx = x + size / 2;
        var cy = y + size / 2;
        var half = size / 2;
        var el = svgRect(-half, -half, size, size, { fill: this.fill });
        return this._wrapTransform(el, cx, cy, rotation);
    };
    // ---- Dot / Dot-small ----
    SvgDot.prototype._drawDot = function (args) {
        return this._drawBasicDot(args, 0.4);
    };
    SvgDot.prototype._drawDotSmall = function (args) {
        return this._drawBasicDot(args, 0.3);
    };
    SvgDot.prototype._drawBasicDot = function (_a, rate) {
        var x = _a.x, y = _a.y, size = _a.size;
        var cx = x + size / 2;
        var cy = y + size / 2;
        return svgCircle(cx, cy, size * rate, { fill: this.fill });
    };
    // ---- Rounded ----
    SvgDot.prototype._drawRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size;
        var origSize = size;
        size = 0.75 * origSize;
        var offset = (1 / 8) * size;
        var cx = x + offset + size / 2;
        var cy = y + offset + size / 2;
        var half = size / 2;
        var d = roundRectPath(-half, -half, size, size, [size / 4, size / 4, size / 4, size / 4]);
        return this._wrapTransform(svgPath(d, { fill: this.fill }), cx, cy, 0);
    };
    // ---- Tile ----
    SvgDot.prototype._drawTile = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size;
        return this._basicSquare(x, y, size - 1, 0);
    };
    // ---- Diamond ----
    SvgDot.prototype._drawDiamond = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size;
        var rotatedSize = (0.5 * size) / Math.sin(Math.PI / 4);
        return this._basicSquare(x, y, rotatedSize, Math.PI / 4);
    };
    // ---- Star ----
    SvgDot.prototype._drawStar = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size;
        var cx = x + size / 2;
        var cy = y + size / 2;
        var half = size / 2;
        var d = "M".concat(-half, " ").concat(-half) +
            "Q0 0 ".concat(half, " ").concat(-half) +
            "Q0 0 ".concat(half, " ").concat(half) +
            "Q0 0 ".concat(-half, " ").concat(half) +
            "Q0 0 ".concat(-half, " ").concat(-half, "Z");
        return this._wrapTransform(svgPath(d, { fill: this.fill }), cx, cy, Math.PI / 4);
    };
    // ---- Fluid / Fluid-line ----
    SvgDot.prototype._drawFluid = function (args, line) {
        if (line === void 0) { line = false; }
        var x = args.x, y = args.y, size = args.size, getNeighbor = args.getNeighbor;
        var cx = x + size / 2;
        var cy = y + size / 2;
        var half = size / 2;
        var r = size / 2;
        var roundedCorners = [false, false, false, false];
        if (!(getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(0, -1)) && !(getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(-1, 0)))
            roundedCorners[0] = true;
        if (!(getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(1, 0)) && !(getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(0, -1)))
            roundedCorners[1] = true;
        if (!(getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(0, 1)) && !(getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(1, 0)))
            roundedCorners[2] = true;
        if (!(getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(0, 1)) && !(getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(-1, 0)))
            roundedCorners[3] = true;
        // Circle at center
        var elements = svgCircle(0, 0, r, { fill: this.fill });
        // Corner fills
        if (!roundedCorners[0])
            elements += svgRect(-half, -half, half, half, { fill: this.fill });
        if (!roundedCorners[1])
            elements += svgRect(0, -half, half, half, { fill: this.fill });
        if (!roundedCorners[2])
            elements += svgRect(0, 0, half, half, { fill: this.fill });
        if (!roundedCorners[3])
            elements += svgRect(-half, 0, half, half, { fill: this.fill });
        if (line) {
            var r2 = size / 4;
            if (!(getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(0, 1))) {
                if (getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(-1, 1)) {
                    // Arc from (-size, 0) to (0, size) forming an L-corner
                    var d1 = "M".concat(-size, " 0A").concat(r2, " ").concat(r2, " 0 0 1 ").concat(-size, " ").concat(r2, "A").concat(r2, " ").concat(r2, " 0 0 1 ").concat(-size + r2, " ").concat(size, "A").concat(r2, " ").concat(r2, " 0 0 1 0 ").concat(size);
                    elements += svgPath(d1, { fill: this.fill });
                }
                if (getNeighbor === null || getNeighbor === void 0 ? void 0 : getNeighbor(1, 1)) {
                    var d2 = "M".concat(size, " 0A").concat(r2, " ").concat(r2, " 0 0 0 ").concat(size, " ").concat(r2, "A").concat(r2, " ").concat(r2, " 0 0 0 ").concat(size - r2, " ").concat(size, "A").concat(r2, " ").concat(r2, " 0 0 0 0 ").concat(size);
                    elements += svgPath(d2, { fill: this.fill });
                }
            }
        }
        return svgGroup(elements, { transform: "translate(".concat(cx, ",").concat(cy, ")"), fill: this.fill });
    };
    SvgDot.prototype._drawFluidLine = function (args) {
        return this._drawFluid(args, true);
    };
    // ---- Stripe variants ----
    SvgDot.prototype._drawStripeColumn = function (args) {
        return this._drawStripe(args, 'column');
    };
    SvgDot.prototype._drawStripeRow = function (args) {
        return this._drawStripe(args, 'row');
    };
    SvgDot.prototype._drawStripe = function (_a, type) {
        var e_1, _b;
        var _this = this;
        var x = _a.x, y = _a.y, size = _a.size, qrData = _a.qrData, _c = _a.i, i = _c === void 0 ? 0 : _c, _d = _a.j, j = _d === void 0 ? 0 : _d;
        if (type === void 0) { type = 'default'; }
        var setRangeDisabled = function (width, height) {
            for (var i1 = i; i1 < i + width; i1++) {
                for (var j1 = j; j1 < j + height; j1++) {
                    qrData === null || qrData === void 0 ? void 0 : qrData.setDisabled(i1, j1);
                }
            }
        };
        var getRangeTrue = function (width, height) {
            for (var i1 = i; i1 < i + width; i1++) {
                for (var j1 = j; j1 < j + height; j1++) {
                    if (!(qrData === null || qrData === void 0 ? void 0 : qrData.isDark(i1, j1)))
                        return false;
                }
            }
            return true;
        };
        var r = size / 4;
        var drawItem = function (width, height) {
            var cx = x + size / 2;
            var cy = y + size / 2;
            setRangeDisabled(width, height);
            if (width === 1 && height === 1) {
                return svgCircle(cx, cy, r, { fill: _this.fill });
            }
            var d = '';
            if (width > 1) {
                // Horizontal pill
                var w = size * (width - 1);
                d = "M0 ".concat(r, "A").concat(r, " ").concat(r, " 0 0 1 0 ").concat(-r, "L").concat(w, " ").concat(-r, "A").concat(r, " ").concat(r, " 0 0 1 ").concat(w, " ").concat(r, "Z");
            }
            else if (height > 1) {
                // Vertical pill
                var h = size * (height - 1);
                d = "M".concat(-r, " 0A").concat(r, " ").concat(r, " 0 0 1 ").concat(r, " 0L").concat(r, " ").concat(h, "A").concat(r, " ").concat(r, " 0 0 1 ").concat(-r, " ").concat(h, "Z");
            }
            if (!d)
                return '';
            return svgGroup(svgPath(d, { fill: _this.fill }), {
                transform: "translate(".concat(cx, ",").concat(cy, ")"),
            });
        };
        var combinations = type === 'row'
            ? [[3, 1], [2, 1], [1, 1]]
            : type === 'column'
                ? [[1, 3], [1, 2], [1, 1]]
                : ([[3, 1], [1, 3], [2, 1], [1, 2], [1, 1]]);
        var result = '';
        try {
            for (var combinations_1 = __values(combinations), combinations_1_1 = combinations_1.next(); !combinations_1_1.done; combinations_1_1 = combinations_1.next()) {
                var _e = __read(combinations_1_1.value, 2), w = _e[0], h = _e[1];
                if (getRangeTrue(w, h)) {
                    result += drawItem(w, h);
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (combinations_1_1 && !combinations_1_1.done && (_b = combinations_1.return)) _b.call(combinations_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    // ---- Helpers ----
    SvgDot.prototype._wrapTransform = function (element, cx, cy, rotation) {
        var transform = "translate(".concat(cx, ",").concat(cy, ")");
        if (rotation) {
            var deg = (rotation * 180) / Math.PI;
            transform += " rotate(".concat(deg, ")");
        }
        return svgGroup(element, { transform: transform });
    };
    return SvgDot;
}());

var SvgCorner = /** @class */ (function () {
    function SvgCorner(cornerType, color) {
        var _this = this;
        this.drawMethodMap = {
            square: function (args) { return _this._drawSquare(args); },
            rounded: function (args) { return _this._drawRounded(args); },
            circle: function (args) { return _this._drawCircle(args); },
            'rounded-circle': function (args) { return _this._drawRoundedCircle(args); },
            'circle-rounded': function (args) { return _this._drawCircleRounded(args); },
            'circle-diamond': function (args) { return _this._drawCircleDiamond(args); },
            'circle-star': function (args) { return _this._drawCircleStar(args); },
        };
        this.cornerType = cornerType;
        this._color = color;
    }
    SvgCorner.prototype.draw = function (args) {
        var drawFunction = this.drawMethodMap[this.cornerType] || this.drawMethodMap['square'];
        return drawFunction(args);
    };
    Object.defineProperty(SvgCorner.prototype, "fill", {
        get: function () {
            return this._color;
        },
        enumerable: false,
        configurable: true
    });
    // ---- Square ----
    SvgCorner.prototype._drawSquare = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize;
        return this._drawBasicRounded(x, y, dotSize, 0, 0);
    };
    // ---- Rounded ----
    SvgCorner.prototype._drawRounded = function (_a) {
        var _b, _c;
        var x = _a.x, y = _a.y, dotSize = _a.dotSize, radius = _a.radius;
        var inner = typeof radius === 'number' ? radius : (_b = radius === null || radius === void 0 ? void 0 : radius.inner) !== null && _b !== void 0 ? _b : dotSize / 4;
        var outer = typeof radius === 'number' ? radius : (_c = radius === null || radius === void 0 ? void 0 : radius.outer) !== null && _c !== void 0 ? _c : dotSize / 2;
        return this._drawBasicRounded(x, y, dotSize, outer, inner);
    };
    // ---- Circle ----
    SvgCorner.prototype._drawCircle = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize;
        return (this._drawOuterCircle(x, y, dotSize, false) +
            this._drawInnerCircle(x, y, dotSize, true));
    };
    // ---- Rounded-Circle (rounded outer, circle inner) ----
    SvgCorner.prototype._drawRoundedCircle = function (_a) {
        var _b;
        var x = _a.x, y = _a.y, dotSize = _a.dotSize, radius = _a.radius;
        var outer = typeof radius === 'number' ? radius : (_b = radius === null || radius === void 0 ? void 0 : radius.outer) !== null && _b !== void 0 ? _b : dotSize / 2;
        return (this._drawRoundedSquare(x, y, dotSize, dotSize * 7, outer, false) +
            this._drawInnerCircle(x, y, dotSize, true));
    };
    // ---- Circle-Rounded (circle outer, rounded inner) ----
    SvgCorner.prototype._drawCircleRounded = function (_a) {
        var _b;
        var x = _a.x, y = _a.y, dotSize = _a.dotSize, radius = _a.radius;
        var inner = typeof radius === 'number' ? radius : (_b = radius === null || radius === void 0 ? void 0 : radius.inner) !== null && _b !== void 0 ? _b : dotSize / 4;
        return (this._drawOuterCircle(x, y, dotSize, false) +
            this._drawRoundedSquare(x, y + 2 * dotSize, dotSize, dotSize * 3, inner, true, 0));
    };
    // ---- Circle-Diamond ----
    SvgCorner.prototype._drawCircleDiamond = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize;
        return (this._drawOuterCircle(x, y, dotSize, false) +
            this._drawDiamondInner(x, y, dotSize));
    };
    // ---- Circle-Star ----
    SvgCorner.prototype._drawCircleStar = function (_a) {
        var x = _a.x, y = _a.y, dotSize = _a.dotSize;
        return (this._drawOuterCircle(x, y, dotSize, false) +
            this._drawStarInner(x, y, dotSize));
    };
    // ---- Shared helpers ----
    SvgCorner.prototype._drawBasicRounded = function (x, y, dotSize, outerRadius, innerRadius) {
        var size = dotSize * 7;
        return (this._drawRoundedSquare(x, y, dotSize, size, outerRadius, false) +
            this._drawRoundedSquare(x + 2 * dotSize, y + 2 * dotSize, dotSize, dotSize * 3, innerRadius, true));
    };
    /**
     * Draw the outer circle of a corner.
     */
    SvgCorner.prototype._drawOuterCircle = function (x, y, dotSize, fill) {
        var size = dotSize * 7;
        var cx = x + size / 2;
        var cy = y + size / 2;
        var r = (size - dotSize) / 2;
        var attrs = {
            fill: fill ? this.fill : 'none',
            stroke: this.fill,
            'stroke-width': String(dotSize),
        };
        return svgCircle(cx, cy, r, attrs);
    };
    /**
     * Draw the inner circle of a corner.
     */
    SvgCorner.prototype._drawInnerCircle = function (x, y, dotSize, fill) {
        var innerSize = dotSize * 3;
        var cx = x + 2 * dotSize + innerSize / 2;
        var cy = y + 2 * dotSize + innerSize / 2;
        var r = innerSize / 2;
        var attrs = {
            fill: fill ? this.fill : 'none',
            stroke: this.fill,
            'stroke-width': String(dotSize),
        };
        return svgCircle(cx, cy, r, attrs);
    };
    /**
     * Draw a rounded square (for outer frame or inner box).
     */
    SvgCorner.prototype._drawRoundedSquare = function (x, y, dotSize, size, radius, fill, rotation) {
        if (rotation === void 0) { rotation = 0; }
        // Adjust so stroke aligns to edges
        var adjX = x + dotSize / 2;
        var adjY = y + dotSize / 2;
        var adjSize = size - dotSize;
        if (!Array.isArray(radius)) {
            radius = [radius, radius, radius, radius];
        }
        radius = radius.map(function (r) { return Math.min(r, adjSize / 2, Math.max(r, 0)); });
        var cx = adjX + adjSize / 2;
        var cy = adjY + adjSize / 2;
        var originX = -adjSize / 2;
        var originY = -adjSize / 2;
        var d = roundRectPath(originX, originY, adjSize, adjSize, radius);
        var attrs = {
            fill: fill ? this.fill : 'none',
            stroke: this.fill,
            'stroke-width': String(dotSize),
        };
        var transform = "translate(".concat(cx, ",").concat(cy, ")");
        if (rotation) {
            transform += " rotate(".concat((rotation * 180) / Math.PI, ")");
        }
        return svgGroup(svgPath(d, attrs), { transform: transform });
    };
    /**
     * Draw the diamond inner shape for circle-diamond corner.
     */
    SvgCorner.prototype._drawDiamondInner = function (x, y, dotSize) {
        var innerSize = dotSize * 3;
        var cx = x + 2 * dotSize + innerSize / 2;
        var cy = y + 2 * dotSize + innerSize / 2;
        var half = innerSize / 2;
        var d = "M".concat(-half, " ").concat(-half, "L").concat(half, " ").concat(-half, "L").concat(half, " ").concat(half, "L").concat(-half, " ").concat(half, "Z");
        return svgGroup(svgPath(d, { fill: this.fill }), {
            transform: "translate(".concat(cx, ",").concat(cy, ") rotate(45)"),
        });
    };
    /**
     * Draw the star inner shape for circle-star corner.
     */
    SvgCorner.prototype._drawStarInner = function (x, y, dotSize) {
        var innerSize = dotSize * 3;
        var cx = x + 2 * dotSize + innerSize / 2;
        var cy = y + 2 * dotSize + innerSize / 2;
        var half = innerSize / 2;
        var d = "M".concat(-half, " ").concat(-half) +
            "Q0 ".concat(-half / 2, " ").concat(half, " ").concat(-half) +
            "Q".concat(half / 2, " 0 ").concat(half, " ").concat(half) +
            "Q0 ".concat(half / 2, " ").concat(-half, " ").concat(half) +
            "Q".concat(-half / 2, " 0 ").concat(-half, " ").concat(-half, "Z");
        return svgPath(d, { fill: this.fill, transform: "translate(".concat(cx, ",").concat(cy, ")") });
    };
    return SvgCorner;
}());

var squareMask = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
];
var dotMask = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];
var ErrorCorrectionPercents = {
    L: 0.07,
    M: 0.15,
    Q: 0.25,
    H: 0.3,
};
var QRSvg = /** @class */ (function () {
    function QRSvg(options) {
        this.qrcodeArray = [];
        this.dotSize = 0;
        this.offset = 0;
        this.inLogoRange = null;
        var content = options.content; options.width; var _b = options.nodeQrCodeOptions, nodeQrCodeOptions = _b === void 0 ? {} : _b;
        nodeQrCodeOptions.errorCorrectionLevel =
            nodeQrCodeOptions.errorCorrectionLevel ||
                getErrorCorrectionLevel(content);
        var QRDATA = QRCode__default["default"].create(content, nodeQrCodeOptions);
        this.options = options;
        this.saveQRData(QRDATA);
    }
    QRSvg.prototype.saveQRData = function (QRDATA) {
        var _a;
        this.size = QRDATA.modules.size;
        this.version = QRDATA.version;
        this.qrcodeArray = QRDATA.modules.data;
        var nodeQrCodeOptions = this.options.nodeQrCodeOptions;
        var margin = (nodeQrCodeOptions === null || nodeQrCodeOptions === void 0 ? void 0 : nodeQrCodeOptions.margin) || defaultOptions.nodeQrCodeOptions.margin;
        var count = this.size;
        var width = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.width) || defaultOptions.width;
        var withoutMarginSize = width - margin * 2;
        this.dotSize = Math.floor(withoutMarginSize / count);
        this.offset = Math.floor((width - count * this.dotSize) / 2);
    };
    QRSvg.prototype.isDark = function (x, y) {
        return this.qrcodeArray[x + y * this.size] === 1;
    };
    QRSvg.prototype.isDisabled = function (x, y) {
        return this.qrcodeArray[x + y * this.size] === 2;
    };
    QRSvg.prototype.setDisabled = function (x, y) {
        this.qrcodeArray[x + y * this.size] = 2;
    };
    /**
     * Main entry: generate full SVG string.
     * Returns SVG XML string (not wrapped in promise since logo is optional).
     */
    QRSvg.prototype.init = function () {
        return __awaiter(this, void 0, Promise, function () {
            var width, body, logoDrawFn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        width = this.options.width || defaultOptions.width;
                        body = '';
                        // Background
                        body += this.drawBackground();
                        return [4 /*yield*/, this.drawLogo()
                            // Dots
                        ];
                    case 1:
                        logoDrawFn = _a.sent();
                        // Dots
                        body += this.drawDots();
                        // Corners
                        body += this.drawCorners();
                        // Logo (after dots/corners, on top)
                        if (logoDrawFn) {
                            body += logoDrawFn();
                        }
                        return [2 /*return*/, wrapSvg(body, width)];
                }
            });
        });
    };
    QRSvg.prototype.drawBackground = function () {
        var _a;
        var nodeQrCodeOptions = this.options.nodeQrCodeOptions;
        var light = ((_a = nodeQrCodeOptions === null || nodeQrCodeOptions === void 0 ? void 0 : nodeQrCodeOptions.color) === null || _a === void 0 ? void 0 : _a.light) ||
            defaultOptions.nodeQrCodeOptions.color.light;
        var width = this.options.width || defaultOptions.width;
        return svgRect(0, 0, width, width, {
            fill: normalizeColor(light),
        });
    };
    /**
     * Start logo image loading and return a function that generates SVG logo markup.
     * Must be called before drawDots() so inLogoRange is set up.
     */
    QRSvg.prototype.drawLogo = function () {
        return __awaiter(this, void 0, Promise, function () {
            var logo;
            var _a;
            return __generator(this, function (_b) {
                logo = (_a = this.options) === null || _a === void 0 ? void 0 : _a.logo;
                if (!logo)
                    return [2 /*return*/, null];
                if (typeof logo === 'string') {
                    logo = { src: logo };
                }
                return [2 /*return*/, this._drawLogo(logo)];
            });
        });
    };
    QRSvg.prototype._drawLogo = function (logo) {
        return __awaiter(this, void 0, Promise, function () {
            var width, coverLevel, maxHiddenDots, src, _a, bgColor, _b, borderWidth, _c, crossOrigin, _d, borderRadius, _e, logoRadius, providedWidth, providedHeight, isDataUrl, imageWidth, imageHeight, logoDataUrl, image, tempCanvas, ctx, rate, logoWidth, logoHeight, logoInnerWidth, logoInnerHeight, maxHeight, xStart, xEnd, yStart, yEnd;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        width = this.options.width || defaultOptions.width;
                        coverLevel = ErrorCorrectionPercents[((_f = this.options.nodeQrCodeOptions) === null || _f === void 0 ? void 0 : _f.errorCorrectionLevel) || 'H'];
                        maxHiddenDots = Math.floor(coverLevel * coverLevel * this.size * this.size);
                        src = logo.src, _a = logo.bgColor, bgColor = _a === void 0 ? defaultOptions.logo.bgColor : _a, _b = logo.borderWidth, borderWidth = _b === void 0 ? defaultOptions.logo.borderWidth : _b, _c = logo.crossOrigin, crossOrigin = _c === void 0 ? defaultOptions.logo.crossOrigin : _c, _d = logo.borderRadius, borderRadius = _d === void 0 ? defaultOptions.logo.borderRadius : _d, _e = logo.logoRadius, logoRadius = _e === void 0 ? defaultOptions.logo.logoRadius : _e, providedWidth = logo.width, providedHeight = logo.height;
                        isDataUrl = src.startsWith('data:image');
                        if (!(isDataUrl && providedWidth && providedHeight)) return [3 /*break*/, 1];
                        // Data URL with provided dimensions - skip loadImage (works in Node.js)
                        imageWidth = providedWidth;
                        imageHeight = providedHeight;
                        logoDataUrl = src;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, loadImage(src, crossOrigin)];
                    case 2:
                        image = _g.sent();
                        imageWidth = image.width;
                        imageHeight = image.height;
                        // Convert to data URL for reliable SVG embedding
                        if (isDataUrl) {
                            logoDataUrl = src;
                        }
                        else {
                            try {
                                tempCanvas = document.createElement('canvas');
                                tempCanvas.width = imageWidth;
                                tempCanvas.height = imageHeight;
                                ctx = tempCanvas.getContext('2d');
                                if (ctx) {
                                    ctx.drawImage(image, 0, 0);
                                    logoDataUrl = tempCanvas.toDataURL('image/png');
                                }
                                else {
                                    logoDataUrl = src;
                                }
                            }
                            catch (_h) {
                                logoDataUrl = src;
                            }
                        }
                        _g.label = 3;
                    case 3:
                        rate = imageWidth / imageHeight;
                        maxHeight = Math.floor(Math.sqrt((this.dotSize * this.dotSize * maxHiddenDots) / rate));
                        if (rate > 1) {
                            logoHeight = maxHeight;
                            logoInnerHeight = maxHeight - 2 * borderWidth;
                            logoInnerWidth = Math.floor(logoInnerHeight * rate);
                            logoWidth = logoInnerWidth + borderWidth * 2;
                        }
                        else {
                            logoWidth = Math.floor(maxHeight * rate);
                            logoInnerWidth = logoWidth - borderWidth * 2;
                            logoInnerHeight = Math.floor(logoInnerWidth / rate);
                            logoHeight = logoInnerHeight + 2 * borderWidth;
                        }
                        xStart = (this.size - Math.ceil(logoWidth / this.dotSize)) / 2;
                        xEnd = this.size - xStart - 1;
                        yStart = (this.size - Math.ceil(logoHeight / this.dotSize)) / 2;
                        yEnd = this.size - yStart - 1;
                        this.inLogoRange = function (i, j) {
                            return i >= xStart && i <= xEnd && j >= yStart && j <= yEnd;
                        };
                        // Return function that generates SVG for the logo
                        return [2 /*return*/, function () {
                                var cx = width / 2;
                                var cy = width / 2;
                                var halfW = logoWidth / 2;
                                var halfH = logoHeight / 2;
                                var innerHalfW = logoInnerWidth / 2;
                                var innerHalfH = logoInnerHeight / 2;
                                var fillColor = normalizeColor(bgColor);
                                var logoElements = '';
                                // Background rect with border radius
                                var bgPath = roundRectPath(-halfW, -halfH, logoWidth, logoHeight, [borderRadius, borderRadius, borderRadius, borderRadius]);
                                logoElements += svgPath(bgPath, { fill: fillColor });
                                // Logo image
                                if (logoRadius > 0) {
                                    // Clip path for rounded logo corners
                                    var clipId = 'qr-logo-clip';
                                    var clipRect = roundRectPath(-innerHalfW, -innerHalfH, logoInnerWidth, logoInnerHeight, [logoRadius, logoRadius, logoRadius, logoRadius]);
                                    logoElements +=
                                        "<clipPath id=\"".concat(clipId, "\">").concat(svgPath(clipRect), "</clipPath>") +
                                            "<image href=\"".concat(logoDataUrl, "\" x=\"").concat(-innerHalfW, "\" y=\"").concat(-innerHalfH, "\" width=\"").concat(logoInnerWidth, "\" height=\"").concat(logoInnerHeight, "\" clip-path=\"url(#").concat(clipId, ")\"/>");
                                }
                                else {
                                    logoElements += "<image href=\"".concat(logoDataUrl, "\" x=\"").concat(-innerHalfW, "\" y=\"").concat(-innerHalfH, "\" width=\"").concat(logoInnerWidth, "\" height=\"").concat(logoInnerHeight, "\"/>");
                                }
                                return svgGroup(logoElements, {
                                    transform: "translate(".concat(cx, ",").concat(cy, ")"),
                                });
                            }];
                }
            });
        });
    };
    QRSvg.prototype.drawDots = function () {
        var _this = this;
        var _a, _b, _c, _d;
        var count = this.size;
        var dotSize = this.dotSize;
        var xBeginning = this.offset;
        var yBeginning = this.offset;
        var filterDots = function (i, j) {
            var _a, _b, _c, _d, _e, _f;
            if (((_a = squareMask[i]) === null || _a === void 0 ? void 0 : _a[j]) ||
                ((_b = squareMask[i - count + 7]) === null || _b === void 0 ? void 0 : _b[j]) ||
                ((_c = squareMask[i]) === null || _c === void 0 ? void 0 : _c[j - count + 7])) {
                return false;
            }
            if (((_d = dotMask[i]) === null || _d === void 0 ? void 0 : _d[j]) ||
                ((_e = dotMask[i - count + 7]) === null || _e === void 0 ? void 0 : _e[j]) ||
                ((_f = dotMask[i]) === null || _f === void 0 ? void 0 : _f[j - count + 7])) {
                return false;
            }
            if (_this.inLogoRange && _this.inLogoRange(i, j))
                return false;
            return true;
        };
        var dotColor = ((_a = this.options.dotsOptions) === null || _a === void 0 ? void 0 : _a.color) ||
            ((_c = (_b = this.options.nodeQrCodeOptions) === null || _b === void 0 ? void 0 : _b.color) === null || _c === void 0 ? void 0 : _c.dark) ||
            defaultOptions.dotsOptions.color;
        var dot = new SvgDot({
            type: ((_d = this.options.dotsOptions) === null || _d === void 0 ? void 0 : _d.type) || defaultOptions.dotsOptions.type,
            dotSize: dotSize,
            color: normalizeColor(dotColor),
        });
        var elements = '';
        var _loop_1 = function (i) {
            var _loop_2 = function (j) {
                if (!filterDots(i, j))
                    return "continue";
                if (!this_1.isDark(i, j))
                    return "continue";
                elements += dot.draw(xBeginning + i * dotSize, yBeginning + j * dotSize, function (xOffset, yOffset) {
                    if (i + xOffset < 0 ||
                        j + yOffset < 0 ||
                        i + xOffset >= count ||
                        j + yOffset >= count)
                        return null;
                    if (!filterDots(i + xOffset, j + yOffset))
                        return null;
                    return _this.isDark(i + xOffset, j + yOffset);
                }, this_1, i, j);
            };
            for (var j = 0; j < count; j++) {
                _loop_2(j);
            }
        };
        var this_1 = this;
        for (var i = 0; i < count; i++) {
            _loop_1(i);
        }
        return elements;
    };
    QRSvg.prototype.drawCorners = function () {
        var e_1, _a;
        var _b, _c, _d, _e;
        var nodeQrCodeOptions = this.options.nodeQrCodeOptions;
        var count = this.size;
        var dotSize = this.dotSize;
        var xBeginning = this.offset;
        var yBeginning = this.offset;
        var cornerColor = normalizeColor(((_b = this.options.cornersOptions) === null || _b === void 0 ? void 0 : _b.color) ||
            ((_c = nodeQrCodeOptions === null || nodeQrCodeOptions === void 0 ? void 0 : nodeQrCodeOptions.color) === null || _c === void 0 ? void 0 : _c.dark) ||
            defaultOptions.cornersOptions.color);
        var corner = new SvgCorner(((_d = this.options.cornersOptions) === null || _d === void 0 ? void 0 : _d.type) || defaultOptions.cornersOptions.type, cornerColor);
        var elements = '';
        var positions = [
            [0, 0],
            [1, 0],
            [0, 1],
        ];
        try {
            for (var positions_1 = __values(positions), positions_1_1 = positions_1.next(); !positions_1_1.done; positions_1_1 = positions_1.next()) {
                var _f = __read(positions_1_1.value, 2), column = _f[0], row = _f[1];
                var x = xBeginning + column * dotSize * (count - 7);
                var y = yBeginning + row * dotSize * (count - 7);
                elements += corner.draw({
                    x: x,
                    y: y,
                    dotSize: dotSize,
                    radius: (_e = this.options.cornersOptions) === null || _e === void 0 ? void 0 : _e.radius,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (positions_1_1 && !positions_1_1.done && (_a = positions_1.return)) _a.call(positions_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return elements;
    };
    return QRSvg;
}());

// VERSION will be replaced by rollup at build time
var VERSION = '1.2.0';
var QrCodeWithLogo = /** @class */ (function () {
    function QrCodeWithLogo(options) {
        var _this = this;
        this.ifCanvasDrawn = false;
        this.ifImageCreated = false;
        this.svgString = null;
        this.defaultOption = {
            canvas: undefined,
            image: undefined,
            content: '',
            width: defaultOptions.width,
            download: defaultOptions.download,
            downloadName: defaultOptions.downloadName,
            nodeQrCodeOptions: {},
            cornersOptions: {},
            dotsOptions: {},
            renderer: defaultOptions.renderer
        };
        this.canvasPromise = new Promise(function (resolve, reject) {
            _this.canvasResolve = resolve;
            _this.canvasReject = reject;
        });
        this.imagePromise = new Promise(function (resolve, reject) {
            _this.imageResolve = resolve;
            _this.imageReject = reject;
        });
        this.svgPromise = new Promise(function (resolve, reject) {
            _this.svgResolve = resolve;
            _this.svgReject = reject;
        });
        // Check environment before try block - throw synchronously for clear error
        var isBrowser = typeof document !== 'undefined';
        var renderer = options.renderer || defaultOptions.renderer;
        if (renderer !== 'svg' && !isBrowser) {
            throw new Error('Canvas renderer requires browser environment. Use renderer: "svg" for Node.js.');
        }
        try {
            this.options = Object.assign({}, this.defaultOption, options);
            // Only create canvas/image elements in browser environment or when needed
            if (this.options.renderer === 'svg') {
                // SVG mode: canvas/image only needed for backward compatibility (getImage)
                // In Node.js without canvas/image provided, skip creation
                if (isBrowser) {
                    if (!this.options.canvas) {
                        this.options.canvas = document.createElement('canvas');
                    }
                    if (!this.options.image) {
                        this.options.image = document.createElement('img');
                    }
                }
                else {
                    // Node.js: use dummy elements if not provided
                    // getImage/getCanvas will still fail but getSvgString works
                    if (!this.options.canvas) {
                        this.options.canvas = undefined;
                    }
                    if (!this.options.image) {
                        this.options.image = undefined;
                    }
                }
            }
            else {
                // Canvas mode: browser environment already verified above
                if (!this.options.canvas) {
                    this.options.canvas = document.createElement('canvas');
                }
                if (!this.options.image) {
                    this.options.image = document.createElement('img');
                }
            }
            if (this.options.renderer === 'svg') {
                this._toSvg()
                    .then(function () {
                    _this.svgResolve();
                })
                    .catch(function (error) {
                    if ((options === null || options === void 0 ? void 0 : options.onError) && isFunction(options.onError)) {
                        options.onError(error);
                    }
                    _this.svgReject(error);
                    _this.canvasReject(error);
                    _this.imageReject(error);
                });
            }
            else {
                this.svgResolve();
                this._toCanvas()
                    .then(function () {
                    return _this._toImage();
                })
                    .catch(function (error) {
                    if ((options === null || options === void 0 ? void 0 : options.onError) && isFunction(options.onError)) {
                        options.onError(error);
                    }
                    _this.canvasReject(error);
                    _this.imageReject(error);
                });
            }
        }
        catch (error) {
            if ((options === null || options === void 0 ? void 0 : options.onError) && isFunction(options.onError)) {
                options.onError(error);
            }
            this.canvasReject(error);
            this.imageReject(error);
            this.svgReject(error);
        }
    }
    /**
     * Deprecated!
     */
    QrCodeWithLogo.prototype.toCanvas = function () {
        throw new Error('toCanvas has been Deprecated!');
    };
    /**
     * Deprecated!
     */
    QrCodeWithLogo.prototype.toImage = function () {
        throw new Error('toImage has been Deprecated!');
    };
    /**
     * draw canvas
     * @returns
     */
    QrCodeWithLogo.prototype._toCanvas = function () {
        var _this = this;
        var qrCanvas = new QRCanvas(this.options);
        return qrCanvas.init().then(function () {
            _this.ifCanvasDrawn = true;
            _this.canvasResolve();
        });
    };
    /**
     * Generate SVG string via QRSvg.
     * Also draws SVG onto canvas and sets image.src for backward compatibility.
     */
    QrCodeWithLogo.prototype._toSvg = function () {
        return __awaiter(this, void 0, Promise, function () {
            var qrSvg, svgStr, dataUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qrSvg = new QRSvg(this.options);
                        return [4 /*yield*/, qrSvg.init()];
                    case 1:
                        svgStr = _a.sent();
                        this.svgString = svgStr;
                        this.ifCanvasDrawn = true;
                        this.canvasResolve();
                        dataUrl = 'data:image/svg+xml,' + encodeURIComponent(svgStr);
                        if (this.options.image) {
                            this.options.image.src = dataUrl;
                        }
                        this.ifImageCreated = true;
                        this.imageResolve();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get image base64 and set image's src attribute .
     * @returns
     */
    QrCodeWithLogo.prototype._toImage = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, toImage(this.options).then(function () {
                        _this.ifImageCreated = true;
                        _this.imageResolve();
                    })];
            });
        });
    };
    /**
     * Get the generated SVG string.
     * Only available when renderer is 'svg'. Throws if renderer is 'canvas'.
     */
    QrCodeWithLogo.prototype.getSvgString = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.svgPromise];
                    case 1:
                        _a.sent();
                        if (this.svgString === null) {
                            throw new Error('SVG string is not available. Use renderer: "svg" option.');
                        }
                        return [2 /*return*/, this.svgString];
                }
            });
        });
    };
    QrCodeWithLogo.prototype.downloadImage = function () {
        return __awaiter(this, arguments, void 0, function (name) {
            if (name === void 0) { name = defaultOptions.downloadName; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.imagePromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, saveImage(this.options.image, name)];
                }
            });
        });
    };
    QrCodeWithLogo.prototype.getImage = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.imagePromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.options.image];
                }
            });
        });
    };
    QrCodeWithLogo.prototype.getCanvas = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.canvasPromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.options.canvas];
                }
            });
        });
    };
    QrCodeWithLogo.version = VERSION;
    return QrCodeWithLogo;
}());

module.exports = QrCodeWithLogo;
