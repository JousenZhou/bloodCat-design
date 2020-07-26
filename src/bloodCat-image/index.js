import {define, WeElement} from 'omi'
define('blc-image', class extends WeElement {
    data = {
        imagesTarget: null,
        src: null
    };

    // ref绑定
    createRef(name, e) {
        this[name] = e;
    }

    // 渲染函数
    render(props) {
        return (
            <canvas ref={(e) => {
                this.createRef('canvas', e)
            }}/>
        )
    }

    // 解析
    async analysis() {
        let {src, mode, width, height} = this.getAttributes(['src', 'mode', 'width', 'height']);
        if (src !== this.src) {
            this.src = src;
            this.imagesTarget = await this.loadImage(src);
        }
        this.imageToCanvas(width, height, this.canvas);
        switch (mode) {
            case 'grey':
                this.gray(this.canvas);
                break;
            case 'old':
                this.old(this.canvas);
                break;
            case 'blackWhite':
                this.blackWhite(this.canvas);
                break;
            case 'reverse':
                this.reverse(this.canvas);
                break;
            case 'depigment':
                this.depigment(this.canvas);
                break;
            case 'comics':
                this.comics(this.canvas);
                break;
            case 'lightEdge':
                this.lightEdge(this.canvas);
                break;
            case 'lightEdgeColor':
                this.lightEdgeColor(this.canvas);
                break;
            case 'triangle':this.triangle(this.canvas);break;
            default:
                console.log(`不支持${mode}模式`)
        }
    }

    // 读取
    loadImage(src) {
        return new Promise(async resolve => {
            let images = new Image();
            images.src = src;
            images.onload = () => {
                resolve(images)
            };
            images.onerror = (e) => {
                console.error(e)
            }
        })
    }

    // 图片绘制canvas【设置宽高】
    imageToCanvas(width, height, canvas) {
        let ctx = canvas.getContext("2d");
        const proportion = (this.imagesTarget.width / this.imagesTarget.height).toFixed(2);
        let width_ = 0;
        let height_ = 0;
        if (width && height) {
            // 宽高有赋值
            width_ = Number(width);
            height_ = Number(height)
        } else if (width && !height) {
            // 只有宽的值
            width_ = Number(width);
            height_ = Number((width_ / proportion).toFixed(2));
        } else if (!width && height) {
            // 只有高的值
            height_ = Number(height);
            width_ = Number((height_ * proportion).toFixed(2));
        } else {
            // 没有赋值则柑橘父元素获取
            let parentNode = this.parentNode;
            let parentHeight = parentNode.offsetHeight;
            let parentWidth = parentNode.offsetWidth;
            height_ = parentHeight;
            width_ = parentWidth
        }
        canvas.width = width_;
        canvas.height = height_;
        ctx.drawImage(this.imagesTarget, 0, 0, canvas.width, canvas.height);
    }

    // 获取props参数
    getAttributes(itemArray) {
        let itemMap = {};
        itemArray.forEach(em => {
            itemMap[em] = this.attributes[em] ? this.attributes[em].nodeValue : null
        });
        return itemMap;
    }

    // 灰度计算
    gray(element) {
        let canvas = element;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let s = 0; s < imgData.data.length; s += 4) {
            let r = imgData.data[s];
            let g = imgData.data[s + 1];
            let b = imgData.data[s + 2];
            let gray = (r + g + b) / 3;
            imgData.data[s] = gray;
            imgData.data[s + 1] = gray;
            imgData.data[s + 2] = gray;
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // 旧化计算
    old(element) {
        let canvas = element;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let s = 0; s < imgData.data.length; s += 4) {
            let r = imgData.data[s];
            let g = imgData.data[s + 1];
            let b = imgData.data[s + 2];
            imgData.data[s] = 0.393 * r + 0.769 * g + 0.189 * b;
            imgData.data[s + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
            imgData.data[s + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // 黑白计算
    blackWhite(element) {
        let canvas = element;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let s = 0; s < imgData.data.length; s += 4) {
            let avg = (imgData.data[s] + imgData.data[s + 1] + imgData.data[s + 2]) / 3;
            imgData.data[s] = imgData.data[s + 1] = imgData.data[s + 2] = avg >= 100 ? 255 : 0;
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // 反向计算
    reverse(element) {
        let canvas = element;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let s = 0; s < imgData.data.length; s += 4) {
            imgData.data[s] = 255 - imgData.data[s];
            imgData.data[s + 1] = 255 - imgData.data[s + 1];
            imgData.data[s + 2] = 255 - imgData.data[s + 2]
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // 去色计算
    depigment(element) {
        let canvas = element;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imgData.data;
        for (let i = 0; i < data.length; i++) {
            let avg = Math.floor((Math.min(data[i], data[i + 1], data[i + 2]) + Math.max(data[i], data[i + 1], data[i + 2])) / 2);
            data[i] = data[i + 1] = data[i + 2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // 连环画计算
    comics(element) {
        let canvas = element;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.height * imgData.width; i++) {
            let r = imgData.data[i * 4],
                g = imgData.data[i * 4 + 1],
                b = imgData.data[i * 4 + 2];

            let newR = Math.abs(g - b + g + r) * r / 256;
            let newG = Math.abs(b - g + b + r) * r / 256;
            let newB = Math.abs(b - g + b + r) * g / 256;
            [imgData.data[i * 4], imgData.data[i * 4 + 1], imgData.data[i * 4 + 2]] = [newR, newG, newB];
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // 照亮边缘计算
    lightEdge(element) {
        let canvas = element;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let collectors = [];
        this.sobel(imgData, function (value) {
            collectors.push(value);
        });
        let w = imgData.width;
        let h = imgData.height;
        let num = 0;
        for (let s = 0; s < w * h * 4; s += 4) {
            imgData.data[s] = collectors[num];
            imgData.data[s + 1] = collectors[num];
            imgData.data[s + 2] = collectors[num];
            num++
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // 擦亮边缘计算
    lightEdgeColor(element) {
        let canvas = element;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let collectors = [];
        this.sobel2(imgData, function (value) {
            collectors.push(value);
        });
        for (let s = 0; s < imgData.data.length; s += 4) {
            imgData.data[s] = collectors[s];
            imgData.data[s + 1] = collectors[s + 1];
            imgData.data[s + 2] = collectors[s + 2]
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // 边缘卷积因子
    sobel(imgData, callback) {
        let p = 3;
        let q = 0;

        let Gradient_X = [
            [-1, -p, -1],
            [0, q, 0],
            [1, p, 1]
        ];

        let Gradient_Y = [
            [-1, 0, 1],
            [-p, q, p],
            [-1, 0, 1]
        ];

        let kernelX = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];

        let kernelY = [
            [-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]
        ];

        let w = imgData.width;
        let h = imgData.height;
        let data = imgData.data;

        //获取x、y所处像素点的rgb值，并返回平均值
        function getAvg(x, y) {
            let i = ((w * y) + x) * 4;
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            return (r + g + b) / 3;
        }

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let pixelX = (
                    (kernelX[0][0] * getAvg(x - 1, y - 1)) +
                    (kernelX[0][1] * getAvg(x, y - 1)) +
                    (kernelX[0][2] * getAvg(x + 1, y - 1)) +
                    (kernelX[1][0] * getAvg(x - 1, y)) +
                    (kernelX[1][1] * getAvg(x, y)) +
                    (kernelX[1][2] * getAvg(x + 1, y)) +
                    (kernelX[2][0] * getAvg(x - 1, y + 1)) +
                    (kernelX[2][1] * getAvg(x, y + 1)) +
                    (kernelX[2][2] * getAvg(x + 1, y + 1))
                );

                let pixelY = (
                    (kernelY[0][0] * getAvg(x - 1, y - 1)) +
                    (kernelY[0][1] * getAvg(x, y - 1)) +
                    (kernelY[0][2] * getAvg(x + 1, y - 1)) +
                    (kernelY[1][0] * getAvg(x - 1, y)) +
                    (kernelY[1][1] * getAvg(x, y)) +
                    (kernelY[1][2] * getAvg(x + 1, y)) +
                    (kernelY[2][0] * getAvg(x - 1, y + 1)) +
                    (kernelY[2][1] * getAvg(x, y + 1)) +
                    (kernelY[2][2] * getAvg(x + 1, y + 1))
                );

                let magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY)) >> 0;

                callback(magnitude, x, y);
            }
        }
    }

    // 边缘卷积因子
    sobel2(imgData, callback) {
        let p = 3;
        let q = 0;

        let w = imgData.width;
        let h = imgData.height;
        let data = imgData.data;

        let Gradient_X = [
            [-1, -p, -1],
            [0, q, 0],
            [1, p, 1]
        ];

        let Gradient_Y = [
            [-1, 0, 1],
            [-p, q, p],
            [-1, 0, 1]
        ];

        //获取x、y所处像素点的rgb值，并返回平均值
        function getAvg(x, y) {
            let i = ((w * y) + x) * 4;
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            return (r + g + b) / 3;
        }

        let getA = function (x, y) {
            let i = ((w * y) + x) * 4;
            return data[i + 3];
        };
        let getR = function (x, y) {
            let i = ((w * y) + x) * 4;
            return data[i];
        };
        let getG = function (x, y) {
            let i = ((w * y) + x) * 4;
            return data[i + 1];
        };
        let getB = function (x, y) {
            let i = ((w * y) + x) * 4;
            return data[i + 2];
        };

        function f(e, x, y) {
            let pixelX =
                (
                    (Gradient_X[0][0] * e(x - 1, y - 1)) +
                    (Gradient_X[0][1] * e(x, y - 1)) +
                    (Gradient_X[0][2] * e(x + 1, y - 1)) +
                    (Gradient_X[1][0] * e(x - 1, y)) +
                    (Gradient_X[1][1] * e(x, y)) +
                    (Gradient_X[1][2] * e(x + 1, y)) +
                    (Gradient_X[2][0] * e(x - 1, y + 1)) +
                    (Gradient_X[2][1] * e(x, y + 1)) +
                    (Gradient_X[2][2] * e(x + 1, y + 1))
                );

            let pixelY =
                (
                    (Gradient_Y[0][0] * e(x - 1, y - 1)) +
                    (Gradient_Y[0][1] * e(x, y - 1)) +
                    (Gradient_Y[0][2] * e(x + 1, y - 1)) +
                    (Gradient_Y[1][0] * e(x - 1, y)) +
                    (Gradient_Y[1][1] * e(x, y)) +
                    (Gradient_Y[1][2] * e(x + 1, y)) +
                    (Gradient_Y[2][0] * e(x - 1, y + 1)) +
                    (Gradient_Y[2][1] * e(x, y + 1)) +
                    (Gradient_Y[2][2] * e(x + 1, y + 1))
                );
            let alpha = 0.5;
            let I_edge = Math.abs(pixelX) * alpha + Math.abs(pixelY) * (1 - alpha);
            callback(I_edge);
        }

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                for (let s = 0; s < 4; s++) {
                    if (s === 0)//R
                    {
                        f(getR, x, y)
                    } else if (s === 1)//G
                    {
                        f(getG, x, y)
                    } else if (s === 2)//b
                    {
                        f(getB, x, y)
                    } else if (s === 3)//a
                    {
                        f(getA, x, y)
                    }
                }
            }
        }
    }

    // 三角因子
    delaunay() {
        let EPSILON = 1.0 / 1048576.0;

        const supertriangle = (vertices) => {
            let xmin = Number.POSITIVE_INFINITY,
                ymin = Number.POSITIVE_INFINITY,
                xmax = Number.NEGATIVE_INFINITY,
                ymax = Number.NEGATIVE_INFINITY,
                i, dx, dy, dmax, xmid, ymid;

            for (i = vertices.length; i--;) {
                if (vertices[i][0] < xmin) xmin = vertices[i][0];
                if (vertices[i][0] > xmax) xmax = vertices[i][0];
                if (vertices[i][1] < ymin) ymin = vertices[i][1];
                if (vertices[i][1] > ymax) ymax = vertices[i][1];
            }

            dx = xmax - xmin;
            dy = ymax - ymin;
            dmax = Math.max(dx, dy);
            xmid = xmin + dx * 0.5;
            ymid = ymin + dy * 0.5;

            return [
                [xmid - 20 * dmax, ymid - dmax],
                [xmid, ymid + 20 * dmax],
                [xmid + 20 * dmax, ymid - dmax]
            ];
        };

        const circumcircle = (vertices, i, j, k) => {
            let x1 = vertices[i][0],
                y1 = vertices[i][1],
                x2 = vertices[j][0],
                y2 = vertices[j][1],
                x3 = vertices[k][0],
                y3 = vertices[k][1],
                fabsy1y2 = Math.abs(y1 - y2),
                fabsy2y3 = Math.abs(y2 - y3),
                xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

            if (fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
                throw new Error("Eek! Coincident points!");

            if (fabsy1y2 < EPSILON) {
                m2 = -((x3 - x2) / (y3 - y2));
                mx2 = (x2 + x3) / 2.0;
                my2 = (y2 + y3) / 2.0;
                xc = (x2 + x1) / 2.0;
                yc = m2 * (xc - mx2) + my2;
            } else if (fabsy2y3 < EPSILON) {
                m1 = -((x2 - x1) / (y2 - y1));
                mx1 = (x1 + x2) / 2.0;
                my1 = (y1 + y2) / 2.0;
                xc = (x3 + x2) / 2.0;
                yc = m1 * (xc - mx1) + my1;
            } else {
                m1 = -((x2 - x1) / (y2 - y1));
                m2 = -((x3 - x2) / (y3 - y2));
                mx1 = (x1 + x2) / 2.0;
                mx2 = (x2 + x3) / 2.0;
                my1 = (y1 + y2) / 2.0;
                my2 = (y2 + y3) / 2.0;
                xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
                yc = (fabsy1y2 > fabsy2y3) ?
                    m1 * (xc - mx1) + my1 :
                    m2 * (xc - mx2) + my2;
            }

            dx = x2 - xc;
            dy = y2 - yc;
            return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
        };

        const dedup = (edges) => {
            let i, j, a, b, m, n;

            for (j = edges.length; j;) {
                b = edges[--j];
                a = edges[--j];

                for (i = j; i;) {
                    n = edges[--i];
                    m = edges[--i];

                    if ((a === m && b === n) || (a === n && b === m)) {
                        edges.splice(j, 2);
                        edges.splice(i, 2);
                        break;
                    }
                }
            }
        };

        return {
            triangulate: function(vertices, key) {
                let n = vertices.length,
                    i, j, indices, st, open, closed, edges, dx, dy, a, b, c;
                if(n < 3)
                    return [];
                vertices = vertices.slice(0);

                if(key)
                    for(i = n; i--; )
                        vertices[i] = vertices[i][key];
                indices = new Array(n);

                for(i = n; i--; )
                    indices[i] = i;

                indices.sort(function(i, j) {
                    return vertices[j][0] - vertices[i][0];
                });
                st = supertriangle(vertices);
                vertices.push(st[0], st[1], st[2]);
                open   = [circumcircle(vertices, n + 0, n + 1, n + 2)];
                closed = [];
                edges  = [];
                for(i = indices.length; i--; edges.length = 0) {
                    c = indices[i];
                    for(j = open.length; j--; ) {
                        dx = vertices[c][0] - open[j].x;
                        if(dx > 0.0 && dx * dx > open[j].r) {
                            closed.push(open[j]);
                            open.splice(j, 1);
                            continue;
                        }
                        dy = vertices[c][1] - open[j].y;
                        if(dx * dx + dy * dy - open[j].r > EPSILON)
                            continue;
                        edges.push(
                            open[j].i, open[j].j,
                            open[j].j, open[j].k,
                            open[j].k, open[j].i
                        );
                        open.splice(j, 1);
                    }
                    dedup(edges);
                    for(j = edges.length; j; ) {
                        b = edges[--j];
                        a = edges[--j];
                        open.push(circumcircle(vertices, a, b, c));
                    }
                }
                for(i = open.length; i--; )
                    closed.push(open[i]);
                open.length = 0;

                for(i = closed.length; i--; )
                    if(closed[i].i < n && closed[i].j < n && closed[i].k < n)
                        open.push(closed[i].i, closed[i].j, closed[i].k);
                return open;
            },
            contains: function(tri, p) {
                if((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
                    (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
                    (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
                    (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1]))
                    return null;

                let a = tri[1][0] - tri[0][0],
                    b = tri[2][0] - tri[0][0],
                    c = tri[1][1] - tri[0][1],
                    d = tri[2][1] - tri[0][1],
                    i = a * d - b * c;
                if(i === 0.0)
                    return null;
                let u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i,
                    v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;
                if(u < 0.0 || v < 0.0 || (u + v) > 1.0)
                    return null;
                return [u, v];
            }
        }
    }

    // 三角形计算
    triangle(element) {
        let Delaunay = this.delaunay();
        let canvas = element;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let jxdvalue = 10;
        let particles = [];
        let collectors = [];
        this.sobel(imgData, function (value,x,y) {
            if (value > 40)
            {
                collectors.push([x, y]);
            }
        });
        for (let i = 0; i < 300; i++) {
            particles.push([Math.random() * canvas.width, Math.random() * canvas.height]);
        }
        let length = ~~(collectors.length / jxdvalue), random;
        for (let l = 0; l < length; l++) {
            random = (Math.random() * collectors.length) << 0;
            particles.push(collectors[random]);
            collectors.splice(random, 1);
        }
        particles.push([0, 0], [0, canvas.height], [canvas.width, 0], [canvas.width, canvas.height]);
        let triangles = Delaunay.triangulate(particles);
        let x1, x2, x3, y1, y2, y3, cx, cy;
        for (let i = 0; i < triangles.length; i += 3) {
            x1 = particles[triangles[i]][0];
            x2 = particles[triangles[i + 1]][0];
            x3 = particles[triangles[i + 2]][0];
            y1 = particles[triangles[i]][1];
            y2 = particles[triangles[i + 1]][1];
            y3 = particles[triangles[i + 2]][1];

//              获取三角形中心点坐标
            cx = ~~((x1 + x2 + x3) / 3);
            cy = ~~((y1 + y2 + y3) / 3);

//              获取中心点坐标的颜色值
            let index = (cy * imgData.width + cx) * 4;
            let color_r = imgData.data[index];
            let color_g = imgData.data[index + 1];
            let color_b = imgData.data[index + 2];

//              绘制三角形
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.fillStyle = "rgba(" + color_r + "," + color_g + "," + color_b + ",1)";
            ctx.fill();
            ctx.restore();
        }
    }

    // 生命周期【更新前】
    async beforeUpdate() {
        await this.analysis();
    }

    // 生命周期【插入到元素后】
    async installed() {
        this.style.display = 'inline-block';
        await this.analysis()
    }
});
