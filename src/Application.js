import scene;
import effects;
import communityart;
import .gameUI;


var PARALLAX_THEME = 'flappybee/parallax/forest';

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
  var monsterGold = 10;
  var monsterHealth = 4
  var hpDifference = 4;
  var bossHealth = monsterHealth * hpDifference;
  var bossGold = 100;

  var heroLevel = 1;
  var heroBank = 0;
  var levelGold = 5;

  var index = 0;
  var monsterImages = ['resources/images/monster.png', 'resources/images/boss_fly.png', 'resources/images/char_hero.png'];
  var target;
  var ttsSkillAmount = 200;
  var extraEffect = scene.addText(' ');
  var miniStage = 1;
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
  var levelUpButton = gameUI.setUp(10, 10, 200, 150, 'resources/images/lvluparrow.png');

  // special skill button
  var toTheSky = gameUI.setUp(10, 250, 100, 100, 'resources/images/nukeee.png');
  // Drag hero
  var dragButton = gameUI.setUp(10, 450, 100, 100, 'resources/images/littleDragon.png');
  // Hero tab button
  var heroTab = gameUI.setUp(250, 900, 100, 100, 'resources/images/heroTabButton.png');
  // MonsterHP bar
  var hpBar = gameUI.progressB(220, 10, 10, 10, 'resources/images/bar_honey_empty.png', 'resources/images/bar_honey_full.png' )

  // Display the hero's info tab
  var count = 0;
  var tabView = gameUI.tabView(0);
  heroTab.registerListener('onDown', function(){
    if(count == 0){
      count +=1;
      tabView = gameUI.tabView(150);
      scene.animate(tabView)
        .then({opacity: 1}, 100)
    }else{
      count = 0;
      scene.animate(tabView)
        .then({opacity: 0}, 100)
    }
  })
  // Calling a draggon to help the hero
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
          displayHealth = scene.addText(target.health.toFixed(1) + '/' + monsterHealth.toFixed(1), {
            x: 130,
            y: 50,
            size: 30
            });
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
        monsterGold += monsterGold*10/100
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
        nextLevelGold = displayText(levelGold, ' gold', -100, 150, 30);
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
var nextLevelGold = displayText(levelGold, ' gold', -100, 150, 30);
var ttsSkillGold = displayText(ttsSkillAmount, ' gold', -100, 350, 30);
var dragonCostText = displayText(dragGold, ' gold', -100, 550, 30);
function displayText (num, string, posX, posY, sizeNum){
  if(num >= 1000){
    var myText = scene.addText((num/1000).toFixed(1) + ' K' + string, {
    x: posX,
    y: posY,
    size: sizeNum
    });
  }else{
    var myText = scene.addText(num.toFixed(1) + string, {
    x: posX,
    y: posY,
    size: sizeNum
    });
  }
  return myText;
}
  // Add the Hero
  var hero = scene.addPlayer({url: 'resources/images/player.png'}, {
    superview: scene.ui,
    x: scene.screen.width/2 - 30,
    y: scene.screen.height - 400,
    zIndex: 1
  });

//Display the monster current health and total health
var displayHealth;
function displayMonsterHealth(currentHP, totalHP){
  displayHealth = scene.addText(currentHP.toFixed(1) + '/' + totalHP.toFixed(1), {
    x: 130,
    y: 50,
    size: 30
  });
  return displayHealth;
}

function createMonster(monsterImage, mHealth){

  var monster = scene.addActor({url: monsterImage}, {
    x: 150,
    y: 400,
    width: 300,
    height: 300,
    health: mHealth
  });

  displayHealth = displayMonsterHealth(monster.health, mHealth);

    hpBar.setValue(1, 100);
    monster.onDestroy(function(){
      displayHealth.destroy();
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
        miniStage = 1;
        var goldReceived = scene.addText('+ ' + bossGold.toFixed(1) + ' gold', {
          x: 300,
          y: startY,
          size: 40
        });
        monsterHealth += monsterHealth*1.5;
        monsterGold += 10;
        hpDifference +=1;
        bossHealth = monsterHealth*hpDifference
        bossGold = monsterGold*10;
      }
      if(index >= monsterImages.length){
        index = 0;
      };
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
        target = createMonster(monsterImages[index], bossHealth);
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
      target.hurt(heroTapDamage*5);
      displayTapDamage(heroTapDamage*5);
      displayHealth.destroy();
      if(miniStage <= 9){
        displayHealth = displayMonsterHealth(target.health, monsterHealth);
        hpBar.setValue(target.health/monsterHealth, 100);
      }else{
        displayHealth = displayMonsterHealth(target.health, bossHealth);
        hpBar.setValue(target.health/bossHealth, 100);
      }
    }else{
      target.hurt(heroTapDamage);
      displayTapDamage(heroTapDamage);
      displayHealth.destroy();
      if(miniStage <= 9){
        displayHealth = displayMonsterHealth(target.health, monsterHealth);
        hpBar.setValue(target.health/monsterHealth, 100);
      }else{
        displayHealth = displayMonsterHealth(target.health, bossHealth);
        hpBar.setValue(target.health/bossHealth, 100);
      }
    }
    effects.firework(extraEffect);
    effects.shake(target);
  });

});
