class Sprite {
    constructor({ position, imageSrc, height,width,scale=1}) {
        this.position = position;
        this.scale=scale
        this.height = height*scale;
        this.width = width*scale;
        this.image = new Image();
        this.image.src = imageSrc;
        
        
        // When the image is loaded, we resize it
        this.image.onload = () => {
            this.resizedImage = this.resizeImage(this.image, this.width, this.height);
        };

        this.c = c; // Assuming 'c' is the 2D context of a canvas
    }

    resizeImage(sourceImage, targetWidth, targetHeight) {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);

        const resizedImage = new Image();
        resizedImage.src = canvas.toDataURL('image/jpeg');

        return resizedImage;
    }

    draw() {
        // Ensure we have a resized image available
        if (this.resizedImage) {
            c.drawImage(this.resizedImage, this.position.x, this.position.y);
        }
    }

    update() {
        this.draw();
    }
}
