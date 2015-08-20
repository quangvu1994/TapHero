import scene;
import effects;
import .GameUI;
import .Calculation;
import .DisplayText;
import .SkillSetUp;

exports = {
  registerMenu: function(button, scrollViewType, rmView1){
    scrollViewType.visible = false;
    button.registerListener('onDown', function(){
      if(!scrollViewType.visible){
        scene.animate(scrollViewType)
          .now({x: 0}, 1)
        scene.animate(rmView1)
          .now({x: 1000}, 1)
        rmView1.visible = false;
        scrollViewType.visible = true;
      }else{
        scene.animate(scrollViewType)
          .now({x: 1000}, 1)
        scrollViewType.visible = false;
      }
    });
  },

  registerLevelUp: function(button, player){
    button.registerListener('onDown', function(){
      if(player.playerBank >= player.levelGold){
        player.level +=1;
        player.displayLevel.destroy();
        player.displayLevel = DisplayText.stringNum(player.level,'Lv. ', -50, 70, 25, playerScrollView)
        player.damageText.destroy();
        player.heroTapDamage = Calculation.playerDPS(player.level);
        // display a new tap damage text
        player.damageText = DisplayText.display(player.heroTapDamage, ' Tap Damage', -60, 0, 25, playerScrollView);
        // display the total gold amount
        player.playerBank -= player.levelGold;
        player.totalGold.destroy();
        player.goldDisplay.destroy();
        player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, playerScrollView);
        player.goldDisplay = DisplayText.display(player.playerBank, ' ', 150, 130, 35, scene.ui);
        player.levelGold += player.levelGold*50/100;
        // display new level gold
        player.nextLevelGold.destroy();
        player.nextLevelGold = DisplayText.display(player.levelGold, ' gold', 320, 100, 25, playerScrollView);
        effects.explode(player.actor);
      }else{
        var notEnough = scene.addText('Not Enough Gold', {
          x: 120,
          y: 250,
          size: 40
        });
        scene.animate(notEnough)
        .now({opacity: 1}, 400)
        .then({opacity: 0}, 500);
      }
    });
  },

  registerBombSkill: function(button, player, monster){
    var exist = false;
    var damageBonus = 100;
    //var skillDescription = scene.addText('Deal ' + damagebonus + '
    var unlockAt = scene.addText('Unlock at level 10', {
      superview: playerScrollView,
      x: 50,
      y: 170,
      size: 30
    });
    button.registerListener('onDown', function(){
      if(player.level >= 10){
        if(player.playerBank >= player.smokeBombAmount){
          unlockAt.destroy();
          player.playerBank -= player.smokeBombAmount;
          player.totalGold.destroy();
          player.goldDisplay.destroy();
          player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, playerScrollView);
          player.goldDisplay = DisplayText.display(player.playerBank, ' ', 150, 130, 35, scene.ui);
          player.smokeBombAmount += 100;
          player.bombDisplay.destroy();
          player.bombDisplay = DisplayText.display(player.smokeBombAmount, ' gold', 320, 170, 25, playerScrollView);
          damageBonus += 10;
          if(!exist){
            var smokeBomb = GameUI.setUp(10, 820, 100, 100, 'resources/images/smokeBomb.png', scene.ui);
            smokeBomb.registerListener('onDown', function(){
              monster.target.hurt(player.heroTapDamage*damageBonus);
              effects.explode(monster.target);
              SkillSetUp.playerSkillCooldown(this, 30);
            });
          }
        }else{
          var notEnough = scene.addText('Not Enough Gold', {
            x: 120,
            y: 250,
            size: 40
          });
          scene.animate(notEnough)
          .now({opacity: 1}, 400)
          .then({opacity: 0}, 500);
        }
      }
    });
  }
}