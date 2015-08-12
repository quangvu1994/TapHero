import scene;

exports = {
  monsterHP: function(stage){
    var hp = 18.5*Math.pow(1.57, Math.min(stage, 150))*Math.pow(1.17, Math.max(stage -150,0));
    return Math.round(hp);
  },

  bossHP: function(stage, mobHP){
    var difficulty = [2,4,6,7,10];
    var index = (stage-1)%5;
    var hp = mobHP*difficulty[index];
    return Math.round(hp);
  }
}