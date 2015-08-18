import scene;
import effects;
import .Calculation;
import .DisplayText;

exports = {
  registerMenu: function(button, bool, scrollViewType){
    var clicked = bool;
    button.registerListener('onDown', function(){
      if(clicked){
        scene.animate(scrollViewType)
          .now({x: 0}, 1)
        clicked = false;
      }else{
        scene.animate(scrollViewType)
          .now({x: 1000}, 1)
        clicked = true;
      }
    });
  },

  registerLevelUp: function(button, player, view){
    button.registerListener('onDown', function(){
      if(player.playerBank >= player.levelGold){
        player.heroLevel +=1;
        player.damageText.destroy();
        player.heroTapDamage = Calculation.playerDPS(player.heroLevel);
        // display a new tap damage text
        player.damageText = DisplayText.display(player.heroTapDamage, ' Tap Damage', -60, 0, 25, view);
        // display the total gold amount
        player.playerBank -= player.levelGold;
        player.totalGold.destroy();
        player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, view);
        player.levelGold += player.levelGold*50/100;
        // display new level gold
        player.nextLevelGold.destroy();
        player.nextLevelGold = DisplayText.display(player.levelGold, ' gold', 320, 100, 25, view);
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

  registerNukeSkill: function(button, player, monster, view){
    button.registerListener('onDown', function(){
      if(player.playerBank >= player.nukeAmount){
        monster.target.hurt(player.heroTapDamage*100);
        effects.explode(monster.target);
        // display total gold amount
        player.playerBank -= player.nukeAmount;
        player.totalGold.destroy();
        player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, view);
        // display the amount of gold to purchase
        player.nukeAmountDisplay.destroy();
        player.nukeAmountDisplay = DisplayText.display(player.nukeAmount, ' gold', 320, 170, 25, view);
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