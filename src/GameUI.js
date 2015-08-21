import scene.ui.ButtonView as ButtonView;
import scene.ui.ProgressBar as ProgressBar;
import ui.ImageView as ImageView;
import ui.ScrollView as ScrollView;
import ui.resource.Image as Image;

var backgroundImage = new Image({url: 'resources/images/menuBG.png'});
var menuBorder = new Image({url: 'resources/images/menuBar.png'});

exports = {
  setUp: function(positionX, positionY, w, h, png, view){
    var x = new ButtonView({
      superview: view,
      x: positionX,
      y: positionY,
      width: w,
      height: h,
      image: png,
      zIndex: 1
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
  tabView: function(){
    var scrollView = new ScrollView({
      superview: scene.ui,
      x: 1000,
      y: 750,
      bounce: false,
      width: scene.screen.width,
      height: 190,
      scrollX: false,
      scrollBounds: {
        minX: 0,
        maxX:backgroundImage.getWidth(),
        minY: 0,
        maxY: backgroundImage.getHeight()
      },
      zIndex: 2
    });
    var imageView = new ImageView({
      superview: scrollView,
      image: backgroundImage,
      width: backgroundImage.getWidth(),
      height: backgroundImage.getHeight()
    });

    return scrollView;
  },

  menuBorder: function(){
    var border = new ImageView({
      superview: scene.ui,
      x: 1000,
      y: 710,
      image: menuBorder,
      width: menuBorder.getWidth(),
      height: menuBorder.getHeight()+50
    });
    return border;
  }
}