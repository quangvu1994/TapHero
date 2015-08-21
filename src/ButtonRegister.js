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
        scene.animate(menuBar)
          .now({x: 0}, 1)
        scene.animate(rmView1)
          .now({x: 1000}, 1)
        rmView1.visible = false;
        scrollViewType.visible = true;
      }else{
        scene.animate(scrollViewType)
          .now({x: 1000}, 1)
        scene.animate(menuBar)
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
    var damageBonus = 90;
    var skillDescription = scene.addText('Deal a lot of damage', {
      superview: playerScrollView,
      x: 40,
      y: 150,
      size: 28
    });
    var unlockAt = scene.addText('Unlock at level 10', {
      superview: playerScrollView,
      x: 20,
      y: 190,
      size: 28
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
          skillDescription.destroy();
          skillDescription = scene.addText('Deal tap damage x' + damageBonus, {
            superview: playerScrollView,
            x: 50,
            y: 170,
            size: 28
          });
          if(!exist){
            var smokeBomb = GameUI.setUp(10, 820, 100, 100, 'resources/images/smokeBomb.png', scene.ui);
            smokeBomb.registerListener('onDown', function(){
              monster.target.hurt(player.heroTapDamage*damageBonus);
              DisplayText.tapDamage(player.heroTapDamage*damageBonus);
              monster.displayHealth.destroy();
              if(monster.bossTime){
                monster.displayHealth = DisplayText.numSlashNum(monster.target.health.toFixed(1), monster.bossHealth, 130, 80, 'HP');
                monster.hpBar.setValue(monster.target.health/monster.bossHealth, 100);
              }else{
                monster.displayHealth = DisplayText.numSlashNum(monster.target.health.toFixed(1), monster.monsterHealth, 130, 80, 'HP');
                monster.hpBar.setValue(monster.target.health/monster.monsterHealth, 100);
              };
              effects.explode(monster.target);
              SkillSetUp.playerSkillCooldown(this, 30);
            });
            exist = true;
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
  },

  registerInternalDeath: function(button, player, monster){
    var exist = false;
    var count = 0;
    var multiplier = 0;
    var perSecond = (1/multiplier)*1000;
    var duration = 10;
    var skillDescription = scene.addText('Deal damage over time', {
      superview: playerScrollView,
      x: 55,
      y: 250,
      size: 28
    });
    var unlockAt = scene.addText('Unlock at level 25', {
      superview: playerScrollView,
      x: 20,
      y: 290,
      size: 28
    });
    button.registerListener('onDown', function(){
      if(player.level >= 25){
        if(player.playerBank >= player.internalDeathAmount){
          unlockAt.destroy();
          player.playerBank -= player.internalDeathAmount;
          player.totalGold.destroy();
          player.goldDisplay.destroy();
          player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, playerScrollView);
          player.goldDisplay = DisplayText.display(player.playerBank, ' ', 150, 130, 35, scene.ui);
          player.internalDeathAmount += 100;
          player.internalDeathDisplay.destroy();
          player.internalDeathDisplay = DisplayText.display(player.internalDeathAmount, ' gold', 320, 270, 25, playerScrollView);
          multiplier += 3;
          perSecond = (1/multiplier)*1000;
          skillDescription.destroy();
          skillDescription = scene.addText('Attack ' + multiplier + ' times/sec', {
            superview: playerScrollView,
            x: 25,
            y: 270,
            size: 28
          });
          if(!exist){
            var internalDeath = GameUI.setUp(100, 820, 100, 100, 'resources/images/deathShadow.png', scene.ui);
            internalDeath.registerListener('onDown', function(){
              var clock = scene.addInterval(function(){
                monster.target.hurt(player.heroTapDamage);
                DisplayText.tapDamage(player.heroTapDamage);
                monster.displayHealth.destroy();
                if(monster.bossTime){
                  monster.displayHealth = DisplayText.numSlashNum(monster.target.health.toFixed(1), monster.bossHealth, 130, 80, 'HP');
                  monster.hpBar.setValue(monster.target.health/monster.bossHealth, 100);
                }else{
                  monster.displayHealth = DisplayText.numSlashNum(monster.target.health.toFixed(1), monster.monsterHealth, 130, 80, 'HP');
                  monster.hpBar.setValue(monster.target.health/monster.monsterHealth, 100);
                };
                count += perSecond;
                if(count/1000 >= duration){
                  count = 0;
                  scene.removeInterval(clock);
                }
              }, perSecond);
              SkillSetUp.playerSkillCooldown(this, 30);
            });
            exist = true;
          };
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
  },

  registerCriticalStrike: function(button, player){
    var exist = false;
    var critChanceBonus = 12;
    var duration = 10;
    var miliseconds = 1000;
    var count = 0;
    var skillDescription = scene.addText('Increase critical chance', {
      superview: playerScrollView,
      x: 50,
      y: 350,
      size: 28
    });
    var unlockAt = scene.addText('Unlock at level 50', {
      superview: playerScrollView,
      x: 20,
      y: 390,
      size: 28
    });
    button.registerListener('onDown', function(){
      if(player.level >= 50){
        if(player.playerBank >= player.criticalStrikeAmount){
          unlockAt.destroy();
          player.playerBank -= player.criticalStrikeAmount;
          player.totalGold.destroy();
          player.goldDisplay.destroy();
          player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, playerScrollView);
          player.goldDisplay = DisplayText.display(player.playerBank, ' ', 150, 130, 35, scene.ui);
          player.criticalStrikeAmount += 100;
          player.critStrikeDisplay.destroy();
          player.critStrikeDisplay = DisplayText.display(player.criticalStrikeAmount, ' gold', 320, 370, 25, playerScrollView);
          critChanceBonus += 3;
          skillDescription.destroy();
          skillDescription = scene.addText('Increase crit chance by ' + critChanceBonus + '%', {
            superview: playerScrollView,
            x: 80,
            y: 370,
            size: 28
          });
          if(!exist){
            var critChance = GameUI.setUp(210, 820, 100, 100, 'resources/images/criticalStrike.png', scene.ui);
            critChance.registerListener('onDown', function(){
              player.critChance += critChanceBonus;
              var clock = scene.addInterval(function(){
                count += miliseconds;
                if(count/1000 >= duration){
                  player.critChance -= critChanceBonus;
                  scene.removeInterval(clock);
                  count = 0;
                }
              }, miliseconds)
              SkillSetUp.playerSkillCooldown(this, 30);
            });
            exist = true;
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