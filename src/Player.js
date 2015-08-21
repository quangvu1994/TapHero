import scene;
import effects;
import .Calculation;
import .DisplayText;
import .GameUI;

exports = {
  playerBuilder: function(){
    this.level = 49;
    this.playerBank = 10000;
    this.levelGold = 5;
    this.critMulti = 10;
    this.critChance = 3;
    this.heroTapDamage = Calculation.playerDPS(this.level);

    this.actor = scene.addPlayer({url: 'resources/images/player.png'}, {
      superview: scene.ui,
      x: scene.screen.width/2 - 30,
      y: scene.screen.height - 410,
      zIndex: 1
    });

    this.damageText = DisplayText.display(this.heroTapDamage, ' Tap Damage', -60, 0, 25, playerScrollView);
    this.displayLevel = DisplayText.stringNum(this.level,'Lv. ', -50, 70, 25, playerScrollView)
    this.nextLevelGold = DisplayText.display(this.levelGold, ' gold', 320, 100, 25, playerScrollView);
    this.totalGold = DisplayText.display(this.playerBank, ' gold', 320, 0, 25, playerScrollView);
    this.goldDisplay = DisplayText.display(this.playerBank, ' ', 150, 130, 35, scene.ui);
    // Skills properties and displayer
    this.smokeBombAmount = 200;
    this.internalDeathAmount = 1000;
    this.criticalStrikeAmount  = 2000;
    this.bombDisplay = DisplayText.display(this.smokeBombAmount, ' gold', 320, 170, 25, playerScrollView);
    this.internalDeathDisplay = DisplayText.display(this.internalDeathAmount, ' gold', 320, 270, 25, playerScrollView);
    this.critStrikeDisplay = DisplayText.display(this.criticalStrikeAmount, ' gold', 320, 370, 25, playerScrollView);
  },

  monsterBuilder: function(stage){
    this.monsterHealth = Calculation.monsterHP(stage);
    this.monsterGold = Calculation.monsterGold(this.monsterHealth,stage);
    this.bossHealth = Calculation.bossHP(stage, this.monsterHealth);
    this.bossGold = Calculation.bossGold(this.monsterGold, stage);
    this.monsterImages = [['resources/monsterImages/boss', 'fly'], ['resources/monsterImages/monsterking', 'idle']];
    this.bossTime = false;
    this.target;
    this.displayHealth;
    this.bossTimer = 30;
    this.displayFightTime;
    this.hpBar = GameUI.progressB(200, 60, 50, 10, 'resources/images/lifebar_empty.png', 'resources/images/lifebar_full.png' )
  }
}