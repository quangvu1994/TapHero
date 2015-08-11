import scene.ui.ButtonView as ButtonView;
import scene.ui.ProgressBar as ProgressBar;
import ui.View as View;


exports = {
  setUp: function(positionX, positionY, w, h, png){
    var x = new ButtonView({
      superview: scene.ui,
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
      fillImage: fImage
    });
    return b;
  },
  tabView: function(h){
    var v = new View({
      superview: scene.ui,
      x: 0,
      y: 750,
      width: scene.screen.width,
      height: h,
      backgroundColor: '#FFFFFF',
      zIndex: 1
    });
    return v;
  }
}