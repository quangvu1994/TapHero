import scene;
import effects;
import .Calculation;
import .DisplayText;

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
        player.heroLevel +=1;
        player.damageText.destroy();
        player.heroTapDamage = Calculation.playerDPS(player.heroLevel);
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

  registerNukeSkill: function(button, player, monster){
    button.registerListener('onDown', function(){
      if(player.playerBank >= player.nukeAmount){
        monster.target.hurt(player.heroTapDamage*100);
        effects.explode(monster.target);
        // display total gold amount
        player.playerBank -= player.nukeAmount;
        player.totalGold.destroy();
        player.goldDisplay.destroy();
        player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, playerScrollView);
        player.goldDisplay = DisplayText.display(player.playerBank, ' ', 150, 130, 35, scene.ui);
        // display the amount of gold to purchase
        player.nukeAmountDisplay.destroy();
        player.nukeAmountDisplay = DisplayText.display(player.nukeAmount, ' gold', 320, 170, 25, playerScrollView);
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
  }
}