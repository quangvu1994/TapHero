import scene;
import effects;
import communityart;
import .gameUI;
import .Calculation;

scene.setTextColor("#FFFFFF");

exports = scene(function() {
  //Add background
  var background = scene.addBackground ({url: 'resources/images/BA_BG.png'});
  var platform = scene.addActor({url: 'resources/images/platform.png'}, {
    x: 120,
    y: 690,
    width: 350,
    height: 500
  });
  // Stage and level
  var stage = 1;
  var miniStage = 0;
  var normal = true;
  var bossTime = false;
  var left;
  var bossIsDead;
  // Monster variables
  var monsterHealth = Calculation.monsterHP(stage);
  var bossHealth = Calculation.bossHP(stage, monsterHealth);
  var monsterGold = Calculation.monsterGold(monsterHealth,stage);
  var bossGold = Calculation.bossGold(monsterGold, stage);

  // Hero variables
  var heroLevel = 10;
  var heroBank = 0;
  var levelGold = 5;
  var critMulti = 10;

  var index = 0;
  var copyIndex;
  var monsterImages = ['resources/images/monster.png', 'resources/images/boss_fly.png', 'resources/images/char_hero.png'];
  var target;
  var ttsSkillAmount = 200;
  var extraEffect = scene.addText(' ');

  // Small Dragon Hero
  var dragLevel = 0;
  var dragExist = false;
  var dragGold = 50;
  var dragDamage = 2;

  // playerDPS calculate the tap damage
  var heroTapDamage = playerDPS(heroLevel);
  function playerDPS(heroLevel){
    var dmg = heroLevel*Math.pow(1.05,heroLevel);
    return dmg;
  };
  // level up button
  var levelUpButton = gameUI.setUp(10, 10, 100, 100, 'resources/images/lvluparrow.png', scene.ui);
  // special skill button
  var toTheSky = gameUI.setUp(10, 250, 100, 100, 'resources/images/nukeee.png', scene.ui);
  // Drag hero
  var dragButton = gameUI.setUp(10, 450, 100, 100, 'resources/images/littleDragon.png', scrollView);
  // Hero tab button
  var heroTab = gameUI.setUp(250, 900, 100, 100, 'resources/images/heroTabButton.png', scene.ui);
  // MonsterHP bar
  var hpBar = gameUI.progressB(220, 60, 50, 10, 'resources/images/bar_honey_empty.png', 'resources/images/bar_honey_full.png' )
  // Leave boss button
  var leaveBoss = gameUI.setUp(420, 30, 100, 100, 'resources/images/heroTabButton.png', scene.ui);
  // Scroll down view
  var scrollView = gameUI.tabView();
  scene.animate(scrollView)
    .now({x: 1000}, 1)

  // Display the leave and fight boss button
  leaveBoss.registerListener('onDown', function(){
    normal = false;
    scene.animate(leaveBoss)
      .then({x: 1000}, 1)
    left = true;
    target.destroy();
  })
  scene.animate(leaveBoss)
    .now({x: 1000}, 1);

  var fightBoss = gameUI.setUp(420, 30, 100, 100, 'resources/images/heroTabButton.png', scene.ui);
  fightBoss.registerListener('onDown', function(){
    scene.animate(fightBoss)
      .then({x: 1000}, 1)
    left = false;
    target.destroy();
  });
  scene.animate(fightBoss)
    .now({x: 1000}, 1);

  // Display the hero's info tab
  var clicked = true;
  heroTab.registerListener('onDown', function(){
    if(clicked){
      scene.animate(scrollView)
        .now({x: 0}, 1)
      clicked = false;
    }else{
      scene.animate(scrollView)
        .now({x: 1000}, 1)
      clicked = true;
    }
  })

  // Calling a dragon to help the hero
  dragButton.registerListener('onDown', function(){
    if(heroBank >= dragGold){
      if(!dragExist){
        var drag = scene.addActor({url: 'resources/images/littleDragon.png'}, {
          x: 450,
          y: 400,
          width: 100,
          heigt: 100
        });
        dragExist = true;

        scene.addInterval(function(){
          target.hurt(dragDamage)
          displayHealth.destroy();
          displayHealth = displayText2(target.health.toFixed(1), monsterHealth, 130, 80, 'HP');
          hpBar.setValue(target.health/monsterHealth, 100);
        }, 3000)
      }
      heroBank -= dragGold;
      totalGold.destroy()
      totalGold = displayText(heroBank, ' gold', scene.screen.width - 250, scene.screen.height - 100, 30);
      // Leveling up: increase damage by 2, increase the cost
      dragLevel += 1;
      dragDamage += 2;
      dragGold += dragGold*50/100
      dragonCostText.destroy();
      dragonCostText = displayText(dragGold, ' gold', -100, 550, 30);
      // Dragon at level 10: Increase hero's damage by 10%
      if(dragLevel == 10){
        heroTapDamage += heroTapDamage*10/100;
        damageText.destroy();
        damageText = displayText(heroTapDamage, ' Tap Damage', -50, scene.screen.height - 100, 30);
      }
      // Dragon at level 25: Increase monster's gold reward by 10%
      if(dragLevel == 25){
        monsterGold *= (1 + 10/100)
      }
      // Dragon at level 50: Do something
      if(dragLevel == 50){
      }
      // Dragon at level 100: Do something
      if(dragLevel == 100){å
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
  });
  // Deal tons of damage if player have enough gold
  toTheSky.registerListener('onDown', function(){
    if(heroBank >= ttsSkillAmount){
      target.hurt(heroTapDamage*100);
      effects.explode(target);
      // display total gold amount
      heroBank -= ttsSkillAmount;
      totalGold.destroy();
      totalGold = displayText(heroBank, ' gold', scene.screen.width - 250, scene.screen.height - 100, 30);
      // display the amount of gold to purchase
      ttsSkillGold.destroy();
      ttsSkillGold = displayText(ttsSkillAmount, ' gold', -100, 350, 30);
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

  // leveling up if player have enough gold to evolve
  levelUpButton.registerListener('onDown', function(){
      if(heroBank >= levelGold){
        heroLevel +=1;
        damageText.destroy();
        heroTapDamage = playerDPS(heroLevel);
        // display a new tap damage text
        damageText = displayText(heroTapDamage, ' Tap Damage', -50, scene.screen.height - 100, 30);
        // display the total gold amount
        heroBank -= levelGold;
        totalGold.destroy();
        totalGold = displayText(heroBank, ' gold', scene.screen.width - 250, scene.screen.height - 100, 30);
        levelGold += levelGold*50/100;
        // display new level gold
        nextLevelGold.destroy();
        nextLevelGold = displayText(levelGold, ' gold', -100, 100, 30);
        effects.explode(hero);
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

  // Initialize first monster
  target = createMonster(monsterImages[index], monsterHealth);
  // Display text info:
  // Hero damage, level gold, total gold, etc
  var damageText = displayText(heroTapDamage, ' Tap Damage', -50, scene.screen.height - 100, 30);
  var totalGold = displayText(heroBank, ' gold', scene.screen.width - 250, scene.screen.height - 100, 30);
  var nextLevelGold = displayText(levelGold, ' gold', -100, 100, 30);
  var ttsSkillGold = displayText(ttsSkillAmount, ' gold', -100, 350, 30);
  var dragonCostText = displayText(dragGold, ' gold', -100, 550, 30);

  function displayText (num, string, posX, posY, sizeNum){
    // Handling scientific notation in progress
    if(num >= 1000){
      // Additing Text can be a function -> reduce the dry code
      var myText = scene.addText((num/1000).toFixed(1) + ' K' + string, {
      x: posX,
      y: posY,
      size: sizeNum,
      zIndex : 1
    });
    }else if(num >= 1000000){
      var myText = scene.addText((num/1000000).toFixed(1) + ' M' + string, {
        x: posX,
        y: posY,
        size: sizeNum,
        zIndex : 1
      });
    }else if(num >= 1000000000){
      var myText = scene.addText((num/1000000000).toFixed(1) + ' B' + string, {
        x: posX,
        y: posY,
        size: sizeNum,
        zIndex : 1
      });
    }else{
      var myText = scene.addText(num.toFixed(1) + string, {
      x: posX,
      y: posY,
      size: sizeNum,
      zIndex: 1
      });
    }
    return myText;
  };
  // Add the Hero
  var hero = scene.addPlayer({url: 'resources/images/player.png'}, {
    superview: scene.ui,
    x: scene.screen.width/2 - 30,
    y: scene.screen.height - 400,
    zIndex: 1
  });

  //Display text in format "String/String"
  var displayHealth;
  var stageInfo = displayText2(miniStage, 10, 300, 35, '');

  function displayText2(leftVal, rightVal, posX, posY, string){
    if(rightVal >= 1000){
      var h = scene.addText((leftVal/1000).toFixed(2)+ 'K /' + (rightVal/1000).toFixed(2) + 'K ' + string, {
        x: posX,
        y: posY,
        size: 30
      });
    }else{
      var h = scene.addText(leftVal+ ' /' + rightVal + ' ' + string, {
        x: posX,
        y: posY,
        size: 30
      });
    }
    return h;
  }

  function createMonster(monsterImage, mHealth){

    var monster = scene.addActor({url: monsterImage}, {
      x: 150,
      y: 400,
      width: 300,
      height: 300,
      health: mHealth
    });
    displayHealth = displayText2(monster.health.toFixed(1), mHealth, 130, 80, 'HP');

      hpBar.setValue(1, 100);
      // Monster/Boss is being killed
      monster.onDestroy(function(){
        if(normal){
          displayHealth.destroy();
          stageInfo.destroy();
          var startY = 450;
          index++;
          if(miniStage <= 9){
            miniStage += 1;
            var goldReceived = scene.addText('+ ' + monsterGold.toFixed(1) + ' gold', {
              x: 300,
              y: startY,
              size: 40
            });
          }else{
            stage += 1;
            miniStage = 0;
            var goldReceived = scene.addText('+ ' + bossGold.toFixed(1) + ' gold', {
              x: 300,
              y: startY,
              size: 40
            });
            scene.animate(leaveBoss)
              .then({x: 1000}, 1);
            monsterHealth = Calculation.monsterHP(stage);
            monsterGold = Calculation.monsterGold(monsterHealth, stage);
            bossHealth = Calculation.bossHP(stage, monsterHealth);
            bossGold = Calculation.bossGold(monsterGold,stage);
            bossTime = false;
          }
          if(index == monsterImages.length){
            index = 0;
          };
          stageInfo = displayText2(miniStage, 10, 300, 35, '');
          heroBank += monsterGold;
          // Animate Gold Received
          scene.animate(goldReceived, 'opacity')
            .now({opacity: 1, y: startY - 75},  500 )
            .then({opacity: 0}, 500 );
          // Display total gold left
          totalGold.destroy();
          totalGold = displayText(heroBank, ' gold', scene.screen.width - 250, scene.screen.height - 100, 30);

          if(miniStage <= 9){
            target = createMonster(monsterImages[index], monsterHealth);
          }else{
            stageInfo.destroy();
            //displayFightLeaveButton(true);
            scene.animate(leaveBoss)
              .then({x: 420}, 1);
            copyIndex = index;
            bossTime = true;
            target = createMonster(monsterImages[index], bossHealth);
          }
        }else{
          displayHealth.destroy();
          if(left){
            bossTime = false;
            index++;
            if(index >= monsterImages.length){
              index = 0;
            }
            scene.animate(fightBoss)
              .then({x: 420}, 1);
            target = createMonster(monsterImages[index], monsterHealth);
          }else{
            bossTime = true;
            scene.animate(leaveBoss)
              .then({x: 420}, 1);
            target = createMonster(monsterImages[copyIndex], bossHealth);
            normal = true;
          }
        }
      });

    return monster;
  };

  // Display the damage every touch
  function displayTapDamage(damage){
    var dam = scene.addText(damage.toFixed(1), {size: 40})
    scene.animate(dam)
      .now({opacity: 1, y: 300}, 500)
      .then({opacity: 0}, 100)
      .then(function(){
        dam.destroy()
      });
  }
  // Effect when touch the screen
  scene.screen.onDown(function(){
    // Calculating criticalHit damage
    var criticalHit = randRangeI(100);
    // 5% crit
    if(criticalHit <= 5){
      var critDisplay = scene.addText('CRITICAL HIT!!!', {
        x: 150,
        y: 200,
        size: 40
      });

      scene.animate(critDisplay)
        .now({opacity: 1}, 300)
        .then({opacity: 0}, 1000);
      // five times the damage
      var dmgTaken = Calculation.criticalMultiplier(heroTapDamage, critMulti);
      target.hurt(dmgTaken);
      displayTapDamage(dmgTaken);
      displayHealth.destroy();
      if(!bossTime){
        displayHealth = displayText2(target.health.toFixed(1), monsterHealth, 130, 80, 'HP');
        hpBar.setValue(target.health/monsterHealth, 100);
      }else{
        displayHealth = displayText2(target.health.toFixed(1), bossHealth, 130, 80, 'HP');
        hpBar.setValue(target.health/bossHealth, 100);
      }
    }else{
      target.hurt(heroTapDamage);
      displayTapDamage(heroTapDamage);
      displayHealth.destroy();
      if(!bossTime){
        displayHealth = displayText2(target.health.toFixed(1), monsterHealth, 130, 80, 'HP');
        hpBar.setValue(target.health/monsterHealth, 100);
      }else{
        displayHealth = displayText2(target.health.toFixed(1), bossHealth, 130, 80, 'HP');
        hpBar.setValue(target.health/bossHealth, 100);
      }
    }
    effects.firework(extraEffect);
    effects.shake(target);
  });

});
