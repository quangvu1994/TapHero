import scene;
import effects;
import communityart;
import .GameUI;
import .Calculation;
import .DisplayText;
import .HeroSetUp;
import .Player;
import .ButtonRegister;

scene.setTextColor("#FFFFFF");

exports = scene(function() {

  //Add background and others views
  var background = scene.addBackground ({url: 'resources/images/BA_BG.png'});
  var platform = scene.addActor({url: 'resources/images/platform.png'}, {
    x: 120,
    y: 690,
    width: 350,
    height: 500
  });
  var heroScrollView = GameUI.tabView();
  scene.animate(heroScrollView)
    .now({x: 1000}, 1);
  var playerScrollView = GameUI.tabView();
  scene.animate(playerScrollView)
    .now({x: 1000}, 1);
  var extraEffect = scene.addText(' ');

  // Stage and level
  var stage = 1;
  var miniStage = 0;
  var normal = true;
  var left;

  // Monster
  var neutralMonster = new Player.monsterBuilder(stage);
  // Player
  var player = new Player.playerBuilder(playerScrollView);
  //Heroes
  var dragon = new HeroSetUp.heroBuild(1, 1, 10, 50, false);
  // Skills
  var ttsSkillAmount = 200;

  // Heroes buttons
  var dragButton = GameUI.setUp(10, 10, 100, 100, 'resources/images/littleDragon.png', heroScrollView);

  // Buttons
  var heroTab = GameUI.setUp(120, 930, 150, 100, 'resources/images/heroTabButton.png', scene.ui);
  var playerTab = GameUI.setUp(-10, 930, 150, 100, 'resources/images/heroTabButton.png', scene.ui);
  ButtonRegister.registerMenu(heroTab, false, heroScrollView);
  ButtonRegister.registerMenu(playerTab, false, playerScrollView);

  var levelUpButton = GameUI.setUp(10, 100, 50, 50, 'resources/images/lvluparrow.png', playerScrollView);
  ButtonRegister.registerLevelUp(levelUpButton, player, playerScrollView);

  var toTheSky = GameUI.setUp(10, 250, 100, 100, 'resources/images/nukeee.png', scene.ui);
  var leaveBoss = GameUI.setUp(420, 30, 100, 100, 'resources/images/heroTabButton.png', scene.ui);


  // Display the leave and fight boss button
  leaveBoss.registerListener('onDown', function(){
    normal = false;
    scene.animate(leaveBoss)
      .then({x: 1000}, 1)
    left = true;
    neutralMonster.target.destroy();
  })
  scene.animate(leaveBoss)
    .now({x: 1000}, 1);

  var fightBoss = GameUI.setUp(420, 30, 100, 100, 'resources/images/heroTabButton.png', scene.ui);
  fightBoss.registerListener('onDown', function(){
    scene.animate(fightBoss)
      .then({x: 1000}, 1)
    left = false;
    neutralMonster.target.destroy();
  });
  scene.animate(fightBoss)
    .now({x: 1000}, 1);

  neutralMonster.target = createMonster(neutralMonster, neutralMonster.monsterHealth);
  // Calling a dragon to help the hero
  HeroSetUp.heroRegister(dragButton, dragon, player, neutralMonster);

  var ttsSkillGold = DisplayText.display(ttsSkillAmount, ' gold', -100, 350, 30, scene.ui);

  //Display text in format "String/String"
  var stageInfo = DisplayText.numSlashNum(miniStage, 10, 300, 35, '');

  // Deal tons of damage if player have enough gold
  toTheSky.registerListener('onDown', function(){
    if(player.playerBank >= ttsSkillAmount){
      target.hurt(player.heroTapDamage*100);
      effects.explode(target);
      // display total gold amount
      player.playerBank -= ttsSkillAmount;
      player.totalGold.destroy();
      player.totalGold = DisplayText.display(player.playerBank, ' gold', scene.screen.width - 250, scene.screen.height - 100, 30, scene.ui);
      // display the amount of gold to purchase
      ttsSkillGold.destroy();
      ttsSkillGold = DisplayText.display(ttsSkillAmount, ' gold', -100, 350, 30, scene.ui);
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

  function createMonster(monster, mHealth){
    var myActor = scene.addActor({url: monster.monsterImages[monster.index]}, {
      x: 150,
      y: 400,
      width: 300,
      height: 300,
      health: mHealth
    });
    monster.displayHealth = DisplayText.numSlashNum(myActor.health.toFixed(1), mHealth, 130, 80, 'HP');
    monster.hpBar.setValue(1, 100);
    // Monster/Boss is being killed
    myActor.onDestroy(function(){
      if(normal){
        monster.displayHealth.destroy();
        stageInfo.destroy();
        var startX = 300;
        var startY = 450;
        monster.index++;
        if(miniStage <= 9){
          miniStage += 1;
          var goldReceived = scene.addText('+ ' + monster.monsterGold.toFixed(1) + ' gold', {
            x: startX,
            y: startY,
            size: 40
          });
        }else{
          stage += 1;
          miniStage = 0;
          var goldReceived = scene.addText('+ ' + monster.bossGold.toFixed(1) + ' gold', {
            x: startX,
            y: startY,
            size: 40
          });
          scene.animate(leaveBoss)
            .then({x: 1000}, 1);
          monster.monsterHealth = Calculation.monsterHP(stage);
          monster.monsterGold = Calculation.monsterGold(monster.monsterHealth, stage);
          monster.bossHealth = Calculation.bossHP(stage, monster.monsterHealth);
          monster.bossGold = Calculation.bossGold(monster.monsterGold,stage);
          monster.bossTime = false;
        }
        if(monster.index == monster.monsterImages.length){
          monster.index = 0;
        };
        stageInfo = DisplayText.numSlashNum(miniStage, 10, 300, 35, '');
        player.playerBank += monster.monsterGold;
        // Animate Gold Received
        scene.animate(goldReceived, 'opacity')
          .now({opacity: 1, y: startY - 75},  500 )
          .then({opacity: 0}, 500 );
        // Display total gold left
        player.totalGold.destroy();
        player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, playerScrollView);

        if(miniStage <= 9){
          monster.target = createMonster(monster, monster.monsterHealth);
        }else{
          stageInfo.destroy();
          //displayFightLeaveButton(true);
          scene.animate(leaveBoss)
            .then({x: 420}, 1);
          monster.copyIndex = monster.index;
          monster.bossTime = true;
          monster.target = createMonster(monster, monster.bossHealth);
        }
      }else{
        monster.displayHealth.destroy();
        if(left){
          monster.bossTime = false;
          monster.index++;
          if(monster.index >= monster.monsterImages.length){
            monster.index = 0;
          }
          scene.animate(fightBoss)
            .then({x: 420}, 1);
          monster.target = createMonster(monster, monster.monsterHealth);
        }else{
          monster.bossTime = true;
          scene.animate(leaveBoss)
            .then({x: 420}, 1);
          monster.target = createMonster(monster, monster.bossHealth);
          normal = true;
        }
      }
    });
    return myActor;
  };

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
      var dmgTaken = Calculation.criticalMultiplier(player.heroTapDamage, player.critMulti);
      neutralMonster.target.hurt(dmgTaken);
      DisplayText.tapDamage(dmgTaken);
      neutralMonster.displayHealth.destroy();
      if(!neutralMonster.bossTime){
        neutralMonster.displayHealth = DisplayText.numSlashNum(neutralMonster.target.health.toFixed(1), neutralMonster.monsterHealth, 130, 80, 'HP');
        neutralMonster.hpBar.setValue(neutralMonster.target.health/neutralMonster.monsterHealth, 100);
      }else{
        neutralMonster.displayHealth = DisplayText.numSlashNum(neutralMonster.target.health.toFixed(1), neutralMonster.bossHealth, 130, 80, 'HP');
        neutralMonster.hpBar.setValue(neutralMonster.target.health/neutralMonster.bossHealth, 100);
      }
    }else{
      neutralMonster.target.hurt(player.heroTapDamage);
      DisplayText.tapDamage(player.heroTapDamage);
      neutralMonster.displayHealth.destroy();
      if(!neutralMonster.bossTime){
        neutralMonster.displayHealth = DisplayText.numSlashNum(neutralMonster.target.health.toFixed(1), neutralMonster.monsterHealth, 130, 80, 'HP');
        neutralMonster.hpBar.setValue(neutralMonster.target.health/neutralMonster.monsterHealth, 100);
      }else{
        neutralMonster.displayHealth = DisplayText.numSlashNum(neutralMonster.target.health.toFixed(1), neutralMonster.bossHealth, 130, 80, 'HP');
        neutralMonster.hpBar.setValue(neutralMonster.target.health/neutralMonster.bossHealth, 100);
      }
    }
    effects.firework(extraEffect);
    effects.shake(neutralMonster.target);
  });
});
