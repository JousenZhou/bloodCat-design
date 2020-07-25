import { render, WeElement, define } from 'omi'
define('blc-image', class extends WeElement {
    // static css = scss.toString();
    data = {};
    // ref绑定
    createRef(name,e){
        this[name] = e;
    }
    // 渲染
    render(props) {
        return (
            <canvas ref={(e)=>{this.createRef('canvas',e)}}/>
        )
    }
    // 分析
    analysis(){
        let { src, mode, width, height } = this.attributes;
    }
    loadImage({src,width,height}){
        return new Promise(resolve => {
            let  images = new Image();
            let _canvas = this.canvas;
            images.src = src;
            images.onload = function()
            {
                /*这里this 指images对象喔*/
                let canvas = _canvas;
                let ctx = canvas.getContext("2d");
                const proportion = (this.width/this.height).toFixed(2);
                let width_ = Number(width) || this.width;
                let height_ = Number(height) || Number((width_/proportion).toFixed(2));
                canvas.width = width_;
                canvas.height = height_;
                ctx.drawImage(this, 0, 0,  canvas.width, canvas.height);
                resolve()
            }
        })


    }
    gray(element){
        let canvas = element;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let s = 0; s < imgData.data.length; s += 4) {
            let r = imgData.data[s];
            let g = imgData.data[s + 1];
            let b = imgData.data[s + 2];
            let Alpha = imgData.data[s + 3];
            let gray = (r + g + b) / 3;
            imgData.data[s] = gray;
            imgData.data[s + 1] = gray;
            imgData.data[s + 2] = gray;
        }
        ctx.putImageData(imgData, 0, 0);
    }
    async installed() {
        let { src, mode, width, height } = this.attributes;
        await this.loadImage({src:src.nodeValue,width:width.nodeValue})
        this.gray()
    }
});
