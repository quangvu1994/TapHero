import scene;

exports = {
  display: function(num, string, posX, posY, sizeNum, view){
    // Handling scientific notation in progress
    if(num >= 1000){
      // Additing Text can be a function -> reduce the dry code
      var myText = scene.addText((num/1000).toFixed(1) + ' K' + string, {
        superview: view,
        x: posX,
        y: posY,
        size: sizeNum,
      });
    }else if(num >= 1000000){
      var myText = scene.addText((num/1000000).toFixed(1) + ' M' + string, {
        superview: view,
        x: posX,
        y: posY,
        size: sizeNum,
      });
    }else if(num >= 1000000000){
      var myText = scene.addText((num/1000000000).toFixed(1) + ' B' + string, {
        superview: view,
        x: posX,
        y: posY,
        size: sizeNum,
      });
    }else{
      var myText = scene.addText(num.toFixed(1) + string, {
        superview: view,
        x: posX,
        y: posY,
        size: sizeNum,
        });
    }
    return myText;
  },
  numSlashNum: function(leftVal, rightVal, posX, posY, string){
    if(rightVal >= 1000){
      var myText = scene.addText((leftVal/1000).toFixed(2)+ 'K /' + (rightVal/1000).toFixed(2) + 'K ' + string, {
        x: posX,
        y: posY,
        size: 30
      });
    }else{
      var myText = scene.addText(leftVal + ' /' + rightVal + ' ' + string, {
        x: posX,
        y: posY,
        size: 30
      });
    };
    return myText;
  },

  stringNum: function(num, string, posX, posY, sizeNum, view){
    if(num >= 1000){
      var myText = scene.addText(string + (num/1000).toFixed(1) + ' K', {
        superview: view,
        x: posX,
        y: posY,
        size: sizeNum
      });
    }else{
      var myText = scene.addText(string + num, {
        superview: view,
        x: posX,
        y: posY,
        size: sizeNum
      });
    };
    return myText;
  },

  tapDamage: function(damage){
    var dmg = scene.addText(damage.toFixed(1), {size: 40})
    scene.animate(dmg)
      .now({opacity: 1, y: 300}, 500)
      .then({opacity: 0}, 100)
      .then(function(){
        dmg.destroy()
      });
    return dmg;
  }
}