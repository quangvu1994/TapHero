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
  },
  monsterGold: function(mobHP, stage){
    var gold = mobHP*(0.02 + (0.00045 * Math.min(stage, 150)))
    return Math.round(gold)*4;
  },
  bossGold: function(mobGold, stage){
    var difficulty = [2,4,6,7,10];
    var index = (stage-1)%5;
    var gold = mobGold*difficulty[index];
    return gold*4;
  },
  criticalMultiplier: function(tapDmg, CritMultiplier){
    var ranNum = Math.random()*(1.1 - 0.3) + 0.3;
    var critDmg = tapDmg*CritMultiplier*ranNum;
    return critDmg;
  },

  playerDPS: function(heroLevel){
    var dmg = heroLevel*Math.pow(1.05,heroLevel);
    return dmg;
  }
}