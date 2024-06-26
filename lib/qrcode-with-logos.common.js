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
    var image = new Image();
    image.setAttribute('crossOrigin', crossOrigin || 'anonymous');
    image.src = logoSrc;
    return new Promise(function (resolve, reject) {
        image.onload = function () {
            resolve(image);
        };
        image.onerror = function () {
            reject('logo load fail!');
        };
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
        var canvas, download, image, downloadName, startDownload;
        return __generator(this, function (_a) {
            canvas = options.canvas, download = options.download;
            image = options.image, downloadName = options.downloadName;
            if (canvas.toDataURL()) {
                image.src = canvas.toDataURL();
            }
            else {
                throw new Error('Can not get the canvas DataURL');
            }
            if (download !== true && !isFunction(download)) {
                return [2 /*return*/];
            }
            // download also can be a function
            download =
                download === true ? function (start) { return start(); } : download;
            startDownload = function () {
                return saveImage(image, downloadName);
            };
            if (download) {
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
            link.dispatchEvent(new MouseEvent('click'));
            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
};

var dotTypes = {
    tile: 'tile',
    dot: 'dot',
    dotSmall: 'dot-small',
    rounded: 'rounded',
    square: 'square',
    diamond: 'diamond',
    star: 'star',
    fluid: 'fluid',
    fluidLine: 'fluid-line',
    stripe: 'stripe',
    stripeColumn: 'stripe-column'
};
var QRDot = /** @class */ (function () {
    function QRDot(options) {
        this._context = options.context;
        this._type = options.type;
        this.dotSize = options.dotSize;
    }
    QRDot.prototype.draw = function (x, y, getNeighbor) {
        var context = this._context;
        var type = this._type;
        var drawFunction;
        switch (type) {
            case dotTypes.tile:
                drawFunction = this._drawTile;
                break;
            case dotTypes.dot:
                drawFunction = this._drawDot;
                break;
            case dotTypes.dotSmall:
                drawFunction = this._drawDotSmall;
                break;
            case dotTypes.rounded:
                drawFunction = this._drawRounded;
                break;
            case dotTypes.diamond:
                drawFunction = this._drawDiamond;
                break;
            case dotTypes.star:
                drawFunction = this._drawStar;
                break;
            case dotTypes.fluid:
                drawFunction = this._drawFluid;
                break;
            case dotTypes.fluidLine:
                drawFunction = this._drawFluidLine;
                break;
            case dotTypes.stripe:
                drawFunction = this._drawStripe;
                break;
            case dotTypes.stripeColumn:
                drawFunction = this._drawStripeColumn;
                break;
            case dotTypes.square:
            default:
                drawFunction = this._drawSquare;
                break;
        }
        drawFunction.call(this, { x: x, y: y, size: this.dotSize, context: context, getNeighbor: getNeighbor });
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
        context.beginPath();
        context.arc(cx, cy, size * dotRate, 0, Math.PI * 2);
        context.closePath();
        // 一次性填充会糊掉，一个个填则没有问题
        context.fill();
    };
    QRDot.prototype._drawRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context;
        size = 0.75 * size;
        x += (1 / 8) * size;
        y += (1 / 8) * size;
        var cx = x + size / 2;
        var cy = y + size / 2;
        var originX = -size / 2;
        context.translate(cx, cy);
        canvasRoundRect(context)(originX, originX, size, size, size / 4);
        context.fill();
        context.translate(-cx, -cy);
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
        if (line) {
            var originLinWidth = context.lineWidth;
            if (getNeighbor(-1, 1)) {
                context.beginPath();
                context.lineWidth = size / 4;
                context.moveTo(0, 0);
                context.lineTo(-size, size);
                context.stroke();
                context.closePath();
            }
            if (getNeighbor(1, 1)) {
                context.beginPath();
                context.lineWidth = size / 4;
                context.moveTo(0, 0);
                context.lineTo(size, size);
                context.stroke();
                context.closePath();
            }
            context.lineWidth = originLinWidth;
        }
        context.translate(-cx, -cy);
    };
    QRDot.prototype._drawStripeColumn = function (args) {
        this._drawStripe(args, 'column');
    };
    QRDot.prototype._drawStripe = function (_a, type) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, getNeighbor = _a.getNeighbor;
        if (type === void 0) { type = 'row'; }
        var cx = x + size / 2;
        var cy = y + size / 2;
        context.translate(cx, cy);
        context.beginPath();
        context.arc(0, 0, size / 4, 0, 2 * Math.PI, false);
        context.fill();
        context.closePath();
        if (type === 'row') {
            if (getNeighbor(-1, 0)) {
                context.fillRect(-size / 2, -size / 4, size / 2, size / 2);
            }
            if (getNeighbor(1, 0)) {
                context.fillRect(0, -size / 4, size / 2, size / 2);
            }
        }
        else if (type === 'column') {
            if (getNeighbor(0, -1)) {
                context.fillRect(-size / 4, -size / 2, size / 2, size / 2);
            }
            if (getNeighbor(0, 1)) {
                context.fillRect(-size / 4, 0, size / 2, size / 2);
            }
        }
        context.translate(-cx, -cy);
    };
    QRDot.prototype._rotateFigure = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, _b = _a.rotation, rotation = _b === void 0 ? 0 : _b, draw = _a.draw;
        var cx = x + size / 2;
        var cy = y + size / 2;
        context.translate(cx, cy);
        rotation && context.rotate(rotation);
        draw();
        context.closePath();
        rotation && context.rotate(-rotation);
        context.translate(-cx, -cy);
    };
    return QRDot;
}());

var cornerTypes = {
    square: 'square',
    rounded: 'rounded',
    circle: 'circle',
    roundedCircle: 'rounded-circle',
    circleRounded: 'circle-rounded',
    circleDiamond: 'circle-diamond',
    circleStar: 'circle-star'
};
var QRCorner = /** @class */ (function () {
    function QRCorner(context, cornerType, color) {
        this.context = context;
        this.cornerType = cornerType;
        this.color = color;
    }
    QRCorner.prototype.draw = function (_a) {
        var radius = _a.radius, x = _a.x, y = _a.y, dotSize = _a.dotSize;
        var drawFunction;
        switch (this.cornerType) {
            case cornerTypes.circle:
                drawFunction = this._drawCircle;
                break;
            case cornerTypes.rounded:
                drawFunction = this._drawRounded;
                break;
            case cornerTypes.roundedCircle:
                drawFunction = this._drawRoundedCircle;
                break;
            case cornerTypes.circleRounded:
                drawFunction = this._drawCircleRounded;
                break;
            case cornerTypes.circleDiamond:
                drawFunction = this._drawCircleDiamond;
                break;
            case cornerTypes.circleStar:
                drawFunction = this._drawCircleStar;
                break;
            case cornerTypes.square:
            default:
                drawFunction = this._drawSquare;
                break;
        }
        drawFunction.call(this, { x: x, y: y, radius: radius, dotSize: dotSize });
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
        var lineWidth = Math.ceil(dotSize);
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
        this.drawRoundedSquare(lineWidth, x, y, size, radiusOuter, false, rotation);
        // Inner box
        size = dotSize * 3;
        y += dotSize * 2;
        x += dotSize * 2;
        this.drawRoundedSquare(lineWidth, x, y, size, radiusInner, true, rotation);
    };
    QRCorner.prototype.drawCircle = function (lineWidth, x, y, size, fill) {
        var ctx = this.context;
        var color = this.color;
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        y += size / 2;
        x += size / 2;
        size -= lineWidth;
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
    };
    QRCorner.prototype.drawRoundedSquare = function (lineWidth, x, y, size, radius, fill, rotation) {
        var ctx = this.context;
        var color = this.color;
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        // Adjust coordinates so that the outside of the stroke is aligned to the edges
        y += lineWidth / 2;
        x += lineWidth / 2;
        size -= lineWidth;
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
        rotation && ctx.rotate(rotation);
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
        rotation && ctx.rotate(-rotation);
        ctx.translate(-cx, -cy);
    };
    QRCorner.prototype.drawInnerStar = function (x, y, size) {
        var context = this.context;
        var cx = x + size / 2;
        var cy = y + size / 2;
        context.translate(cx, cy);
        context.beginPath();
        context.moveTo(-size / 2, -size / 2);
        context.quadraticCurveTo(0, -size / 4, size / 2, -size / 2);
        context.quadraticCurveTo(size / 4, 0, size / 2, size / 2);
        context.quadraticCurveTo(0, size / 4, -size / 2, size / 2);
        context.quadraticCurveTo(-size / 4, 0, -size / 2, -size / 2);
        context.closePath();
        context.fill();
        context.translate(-cx, -cy);
    };
    return QRCorner;
}());

var defaultOptions = {
    logo: {
        logoSize: 0.15,
        borderSize: 0.05,
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
    }
};

var squareMask = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];
var dotMask = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];
var ErrorCorrectionPercents = {
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
        this.saveQrdata(QRDATA);
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
    QRCanvas.prototype.saveQrdata = function (QRDATA) {
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
                        coverLevel = ErrorCorrectionPercents[this.options.nodeQrCodeOptions.errorCorrectionLevel];
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
                                this.context.fillStyle = bgColor;
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
            canvasContext.fillStyle = light;
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
                if (((_a = squareMask[i]) === null || _a === void 0 ? void 0 : _a[j]) ||
                    ((_b = squareMask[i - count_1 + 7]) === null || _b === void 0 ? void 0 : _b[j]) ||
                    ((_c = squareMask[i]) === null || _c === void 0 ? void 0 : _c[j - count_1 + 7])) {
                    return false;
                }
                // 排除定位点
                if (((_d = dotMask[i]) === null || _d === void 0 ? void 0 : _d[j]) ||
                    ((_e = dotMask[i - count_1 + 7]) === null || _e === void 0 ? void 0 : _e[j]) ||
                    ((_f = dotMask[i]) === null || _f === void 0 ? void 0 : _f[j - count_1 + 7])) {
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
            canvasContext.fillStyle = canvasContext.strokeStyle =
                ((_b = this.options.dotsOptions) === null || _b === void 0 ? void 0 : _b.color) ||
                    ((_d = (_c = this.options.nodeQrCodeOptions) === null || _c === void 0 ? void 0 : _c.color) === null || _d === void 0 ? void 0 : _d.dark) ||
                    defaultOptions.dotsOptions.color;
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
                            return false;
                        if (!filterDots_1(i + xOffset, j + yOffset))
                            return false;
                        return _this.isDark(i + xOffset, j + yOffset);
                    });
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
            var margin = (nodeQrCodeOptions_1 === null || nodeQrCodeOptions_1 === void 0 ? void 0 : nodeQrCodeOptions_1.margin) || defaultOptions.nodeQrCodeOptions.margin;
            var count_2 = this.size;
            var width = this.options.width || defaultOptions.width;
            /**二维码除去margin的实际宽度 */
            var minSize = width - margin * 2;
            /**每个像素点宽度 */
            var dotSize_1 = Math.floor(minSize / count_2);
            /**二维码起始位置x */
            var xBeginning_1 = Math.floor((width - count_2 * dotSize_1) / 2);
            /**二维码起始位置y */
            var yBeginning_1 = Math.floor((width - count_2 * dotSize_1) / 2);
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
                var corner = new QRCorner(_this.context, cornersOptions.type || defaultOptions.cornersOptions.type, cornersOptions.color ||
                    ((_b = nodeQrCodeOptions_1 === null || nodeQrCodeOptions_1 === void 0 ? void 0 : nodeQrCodeOptions_1.color) === null || _b === void 0 ? void 0 : _b.dark) ||
                    defaultOptions.cornersOptions.color);
                corner.draw({
                    x: x,
                    y: y,
                    dotSize: _this.dotSize,
                    radius: cornersOptions.radius
                });
            });
        }
    };
    return QRCanvas;
}());

var version = "1.0.6";

var QrCodeWithLogo = /** @class */ (function () {
    function QrCodeWithLogo(options) {
        var _this = this;
        this.ifCanvasDrawed = false;
        this.ifImageCreated = false;
        this.drawImagePromiseResolve = [];
        this.drawCanvasPromiseResolve = [];
        this.defaultOption = {
            canvas: undefined,
            image: undefined,
            content: '',
            width: defaultOptions.width,
            download: defaultOptions.download,
            downloadName: defaultOptions.downloadName
        };
        try {
            this.options = Object.assign(this.defaultOption, options);
            if (!this.options.canvas)
                this.options.canvas = document.createElement('canvas');
            if (!this.options.image)
                this.options.image = document.createElement('img');
            this._toCanvas().then(function () {
                return _this._toImage();
            });
        }
        catch (err) {
            if ((options === null || options === void 0 ? void 0 : options.onError) && isFunction(options.onError)) {
                options.onError(err);
            }
        }
    }
    QrCodeWithLogo.prototype.drawImagePromise = function () {
        var _this = this;
        if (this.ifImageCreated)
            return Promise.resolve();
        return new Promise(function (resolve) {
            _this.drawImagePromiseResolve.push(resolve);
        });
    };
    QrCodeWithLogo.prototype.drawCanvasPromise = function () {
        var _this = this;
        if (this.ifCanvasDrawed)
            return Promise.resolve();
        return new Promise(function (resolve) {
            _this.drawCanvasPromiseResolve.push(resolve);
        });
    };
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
            _this.ifCanvasDrawed = true;
            _this.drawCanvasPromiseResolve.forEach(function (fn) {
                if (isFunction(fn))
                    fn();
            });
            _this.drawCanvasPromiseResolve.length = 0;
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
                        _this.drawImagePromiseResolve.forEach(function (fn) {
                            if (isFunction(fn))
                                fn();
                        });
                        _this.drawImagePromiseResolve.length = 0;
                    })];
            });
        });
    };
    QrCodeWithLogo.prototype.downloadImage = function () {
        return __awaiter(this, arguments, void 0, function (name) {
            if (name === void 0) { name = defaultOptions.downloadName; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.drawImagePromise()];
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
                    case 0: return [4 /*yield*/, this.drawImagePromise()];
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
                    case 0: return [4 /*yield*/, this.drawCanvasPromise()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.options.canvas];
                }
            });
        });
    };
    QrCodeWithLogo.version = version;
    return QrCodeWithLogo;
}());

module.exports = QrCodeWithLogo;
