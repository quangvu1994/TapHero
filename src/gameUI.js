import scene.ui.ButtonView as ButtonView;
import scene.ui.ProgressBar as ProgressBar;
//import scene.ui.Background as Background;
import ui.ImageView as ImageView;
import ui.ScrollView as ScrollView;
import ui.resource.Image as Image;

var backgroundImage = new Image({url: 'resources/images/menuBg.png'});
var scrollView;
exports = {
  setUp: function(positionX, positionY, w, h, png, view){
    var x = new ButtonView({
      superview: view,
      x: positionX,
      y: positionY,
      width: w,
      height: h,
      image: png
    });
    return x;
  },
  progressB: function(positionX, positionY, w, h, png, fImage){
    var b = new ProgressBar({
      superview: scene.ui,
      x: positionX,
      y: positionY,
      width: w,
      height: h,
      image: png,
      fillImage: fImage,
    });
    return b;
  },

  menuBg: function(){
    var bg = new Background({
      superview: scene.ui,
      x: 100,
      y: 300,
      image: backgroundImage
    })
    return bg;
  },


  tabView: function(){
      scrollView = new ScrollView({
      superview: scene.ui,
      x: 0,
      y: 750,
      bounce: false,
      width: scene.screen.width,
      height: 200,
      scrollX: false,
      scrollBounds: {
        minX: 0,
        maxX:backgroundImage.getWidth(),
        minY: 0,
        maxY: backgroundImage.getHeight()
      }
    });

    var imageView = new ImageView({
      superview: scrollView,
      image: backgroundImage,
      width: backgroundImage.getWidth(),
      height: backgroundImage.getHeight()
    });
    /*
    var button = new ButtonView({
      superview: scrollView,
      x: 100,
      y: 100,
      image: 'resources/images/littleDragon.png',
      zIndex: 1
    });*/
    return scrollView;
  }
}