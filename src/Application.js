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
var HERO_WIDTH = 80;
var HERO_HEIGHT = 80;

exports = scene(function() {
  //Add background and others views
  var background = scene.addBackground ({url: 'resources/images/BA_BG.png'});
  var platform = scene.addActor({url: 'resources/images/platform.png'}, {
    x: -150,
    y: 690,
    width: 1000,
    height: 500
  });
  var heroScrollView = GameUI.tabView();
  scene.animate(heroScrollView)
    .now({x: 1000}, 1);

  var playerScrollView = GameUI.tabView();
  scene.animate(playerScrollView)
    .now({x: 1000}, 1);
  var extraEffect = scene.addText(' ');

  // Stage info
  var stage = 1;
  var miniStage = 0;
  var normal = true;
  var left;
  var stageDisplay = DisplayText.numSlashNum(miniStage, 10, 300, 35, '');

  // Monster
  var neutralMonster = new Player.monsterBuilder(stage);
  // Player
  var player = new Player.playerBuilder(playerScrollView);
  //Heroes
  var dragon = new HeroSetUp.heroBuild(1, 10, 1, 'resources/images/littleDragon.png', [10, 450, 400], heroScrollView);
  var angryKitty = new HeroSetUp.heroBuild(2, 100, 1, 'resources/images/angryKitty.png', [100, 100, 630], heroScrollView);
  // Heroes buttons
  var dragButton = GameUI.setUp(20, 20, HERO_WIDTH, HERO_HEIGHT, dragon.image, heroScrollView);
  var angryKittyButton = GameUI.setUp(20, 120, HERO_WIDTH, HERO_HEIGHT, angryKitty.image, heroScrollView);

  // Buttons
  var heroTab = GameUI.setUp(120, 930, 150, 100, 'resources/images/heroTabButton.png', scene.ui);
  var playerTab = GameUI.setUp(-10, 930, 150, 100, 'resources/images/heroTabButton.png', scene.ui);
  var levelUpButton = GameUI.setUp(10, 100, 50, 50, 'resources/images/lvluparrow.png', playerScrollView);
  var nuke = GameUI.setUp(10, 180, 50, 50, 'resources/images/nukeee.png', playerScrollView);
  var leaveBoss = GameUI.setUp(420, 30, 100, 100, 'resources/images/heroTabButton.png', scene.ui);
  var fightBoss = GameUI.setUp(420, 30, 100, 100, 'resources/images/heroTabButton.png', scene.ui);
  ButtonRegister.registerMenu(heroTab, heroScrollView, playerScrollView);
  ButtonRegister.registerMenu(playerTab, playerScrollView, heroScrollView);
  ButtonRegister.registerLevelUp(levelUpButton, player, playerScrollView);
  ButtonRegister.registerNukeSkill(nuke, player, neutralMonster, playerScrollView);

  // Setting up heroes
  HeroSetUp.heroRegister(dragButton, dragon, player, neutralMonster, [1,4,5,6], [playerScrollView, heroScrollView]);
  HeroSetUp.heroRegister(angryKittyButton, angryKitty, player, neutralMonster, [1,4,5,6], [playerScrollView, heroScrollView]);

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

  fightBoss.registerListener('onDown', function(){
    scene.animate(fightBoss)
      .then({x: 1000}, 1)
    left = false;
    neutralMonster.target.destroy();
  });
  scene.animate(fightBoss)
    .now({x: 1000}, 1);

  var mobIndex = 0;
  var bossIndex = 0;
  neutralMonster.target = createMonster(neutralMonster, neutralMonster.monsterHealth, mobIndex);
  function createMonster(monster, mHealth, index){
      var myActor = scene.addActor({url: monster.monsterImages[index]}, {
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
        stageDisplay.destroy();
        var startX = 300;
        var startY = 450;
        mobIndex++;
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
        if(mobIndex == monster.monsterImages.length){
          mobIndex = 0;
        };
        stageDisplay = DisplayText.numSlashNum(miniStage, 10, 300, 35, '');
        player.playerBank += monster.monsterGold;
        // Animate Gold Received
        scene.animate(goldReceived, 'opacity')
          .now({opacity: 1, y: startY - 75},  500 )
          .then({opacity: 0}, 500 );
        // Display total gold left
        player.totalGold.destroy();
        player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, playerScrollView);

        if(miniStage <= 9){
          monster.target = createMonster(monster, monster.monsterHealth, mobIndex);
        }else{
          stageDisplay.destroy();
          //displayFightLeaveButton(true);
          scene.animate(leaveBoss)
            .then({x: 420}, 1);
          bossIndex = mobIndex;
          monster.bossTime = true;
          monster.target = createMonster(monster, monster.bossHealth, bossIndex);
        }
      }else{
        monster.displayHealth.destroy();
        if(left){
          monster.bossTime = false;
          mobIndex++;
          if(mobIndex >= monster.monsterImages.length){
            mobIndex = 0;
          }
          scene.animate(fightBoss)
            .then({x: 420}, 1);
          monster.target = createMonster(monster, monster.monsterHealth, mobIndex);
        }else{
          monster.bossTime = true;
          scene.animate(leaveBoss)
            .then({x: 420}, 1);
          monster.target = createMonster(monster, monster.bossHealth, bossIndex);
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
