import scene;
import effects;
import .Calculation;
import .DisplayText;
import .GameUI;

exports = {
  playerBuilder: function(view){
    this.heroLevel = 10;
    this.playerBank = 0;
    this.levelGold = 5;
    this.critMulti = 10;
    this.heroTapDamage = Calculation.playerDPS(this.heroLevel);

    this.actor = scene.addPlayer({url: 'resources/images/player.png'}, {
      superview: scene.ui,
      x: scene.screen.width/2 - 30,
      y: scene.screen.height - 400,
      zIndex: 1
    });

    this.damageText = DisplayText.display(this.heroTapDamage, ' Tap Damage', -60, 0, 25, view);
    this.nextLevelGold = DisplayText.display(this.levelGold, ' gold', -50, 100, 25, view);
    this.totalGold = DisplayText.display(this.playerBank, ' gold', 320, 0, 25, view);
  },

  monsterBuilder: function(stage){
    this.monsterHealth = Calculation.monsterHP(stage);
    this.monsterGold = Calculation.monsterGold(this.monsterHealth,stage);
    this.bossHealth = Calculation.bossHP(stage, this.monsterHealth);
    this.bossGold = Calculation.bossGold(this.monsterGold, stage);
    this.monsterImages = ['resources/images/monster.png', 'resources/images/boss_fly.png', 'resources/images/char_hero.png'];
    this.index = 0;
    this.copyIndex;
    this.bossTime = false;
    this.target;
    this.displayHealth;
    this.hpBar = GameUI.progressB(220, 60, 50, 10, 'resources/images/bar_honey_empty.png', 'resources/images/bar_honey_full.png' )
  }
}