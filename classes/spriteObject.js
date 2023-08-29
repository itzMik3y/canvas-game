class SpriteObject {
    constructor({ position, imageSrc,scale=1,framesMax=1,offset={x:0,y:0}}) {
        this.position = position;
        this.scale=scale
        this.height = 0;
        this.width = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.framesMax=framesMax
        this.framesCurrent=0
        this.framesElapsed=0
        this.framesHold=15
        this.offset=offset
      
    }


    draw() {
      const sourceWidth = this.image.width / this.framesMax;
      const sourceHeight = this.image.height;
  
      // Calculate the desired width and height while maintaining the aspect ratio
      const desiredWidth = sourceWidth * this.scale;
      const aspectRatio = sourceWidth / sourceHeight;
      const desiredHeight = desiredWidth / aspectRatio;
  
      c.drawImage(
          this.image,
          this.framesCurrent * sourceWidth,
          0,
          sourceWidth,
          sourceHeight,
          this.position.x - this.offset.x,
          this.position.y - this.offset.y,
          desiredWidth,
          desiredHeight
      );
  }
  
  
  

    update() {
        this.draw();
        this.animateFrames()
       
    }
    animateFrames(){
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
              this.framesCurrent++
            } else {
              this.framesCurrent = 0
            }
          }
    }
}
