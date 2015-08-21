import scene;
import effects;
import communityart;
import ui.ImageView as ImageView;
import ui.resource.Image as Image
import .GameUI;
import .Calculation;
import .DisplayText;
import .HeroSetUp;
import .Player;
import .ButtonRegister;

scene.setTextColor("#FFFFFF");
var BUTTON_WIDTH = 80;
var BUTTON_HEIGHT = 80;
heroScrollView = null;
playerScrollView = null;
menuBar = null;

exports = scene(function() {
  //Add background and others views
  var background = scene.addBackground ({url: 'resources/images/BA_BG.png'});
  var coinImage = scene.addImage({url: 'resources/images/coin.png'}, 180, 120, 100, 100);
  var platform = scene.addImage({url: 'resources/images/platform.png'}, -150, 650, 1000, 600);
  heroScrollView = GameUI.tabView();
  playerScrollView = GameUI.tabView();
  menuBar = GameUI.menuBorder();
  var extraEffect = scene.addText(' ');

  // Stage info
  var stage = 1;
  var miniStage = 0;
  var normal = true;
  var left;
  var clock;
  var stageDisplay = DisplayText.numSlashNum(miniStage, 10, 300, 35, '');

  // Monster
  var neutralMonster = new Player.monsterBuilder(stage);
  // Player
  var player = new Player.playerBuilder();
  //Heroes
  var dragon = new HeroSetUp.heroBuild(1, 10, 50, 'resources/images/littleDragon.png', [10, 450, 400], heroScrollView);
  var angryKitty = new HeroSetUp.heroBuild(2, 100, 100, 'resources/images/angryKitty.png', [100, 100, 630], heroScrollView);
  // Heroes buttons
  var dragButton = GameUI.setUp(20, 20, BUTTON_WIDTH, BUTTON_HEIGHT, dragon.image, heroScrollView);
  var angryKittyButton = GameUI.setUp(20, 120, BUTTON_WIDTH, BUTTON_HEIGHT, angryKitty.image, heroScrollView);

  // Buttons
  var heroTab = GameUI.setUp(120, 930, 150, 100, 'resources/images/heroTabButton.png', scene.ui);
  var playerTab = GameUI.setUp(-10, 930, 150, 100, 'resources/images/heroTabButton.png', scene.ui);
  var levelUpButton = GameUI.setUp(10, 100, 50, 50, 'resources/images/lvluparrow.png', playerScrollView);
  var leaveBoss = GameUI.setUp(420, 30, 100, 100, 'resources/images/heroTabButton.png', scene.ui);
  var fightBoss = GameUI.setUp(420, 30, 100, 100, 'resources/images/heroTabButton.png', scene.ui);
  ButtonRegister.registerMenu(heroTab, heroScrollView, playerScrollView);
  ButtonRegister.registerMenu(playerTab, playerScrollView, heroScrollView);
  ButtonRegister.registerLevelUp(levelUpButton, player);

  //Player's skill buttons
  var smokeBombButton = GameUI.setUp(10, 180, 50, 50, 'resources/images/smokeBomb.png', playerScrollView);
  var internalDeath = GameUI.setUp(10, 280, 50, 50, 'resources/images/deathShadow.png', playerScrollView);
  ButtonRegister.registerBombSkill(smokeBombButton, player, neutralMonster);
  ButtonRegister.registerInternalDeath(internalDeath, player, neutralMonster);

  // Setting up heroes
  HeroSetUp.heroRegister(dragButton, dragon, player, neutralMonster, [1,4,5,6]);
  HeroSetUp.heroRegister(angryKittyButton, angryKitty, player, neutralMonster, [1,4,5,6]);

  // Display the leave and fight boss button
  leaveBoss.registerListener('onDown', function(){
    scene.removeInterval(clock);
    neutralMonster.displayFightTime.destroy();
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
  var startX = 300;
  var startY = 450;
  var goldReceiveTracker = false;
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
        mobIndex++;
        if(miniStage <= 9){
          miniStage += 1;
          var goldReceived = scene.addText('+ ' + monster.monsterGold.toFixed(1) + ' gold', {
            x: startX,
            y: startY,
            size: 40
          });
          player.playerBank += monster.monsterGold;
        }else{
          stage += 1;
          miniStage = 0;
          var goldReceived = scene.addText('+ ' + monster.bossGold.toFixed(1) + ' gold', {
            x: startX,
            y: startY,
            size: 40
          });
          player.playerBank += monster.bossGold;
          scene.animate(leaveBoss)
            .then({x: 1000}, 1);
          scene.removeInterval(clock);
          monster.displayFightTime.destroy();
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
        // Animate Gold Received
        scene.animate(goldReceived, 'opacity')
          .now({opacity: 1, y: startY - 75},  500 )
          .then({opacity: 0}, 500 );
        // Display total gold left
        player.totalGold.destroy();
        player.goldDisplay.destroy();
        player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, playerScrollView);
        player.goldDisplay = DisplayText.display(player.playerBank, ' ', 150, 130, 35, scene.ui);

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
          effects.radial(monster.target);

          var miliseconds = 100;
          var count = 0;
          var timeleft = 0;
          monster.displayFightTime = DisplayText.display(monster.bossTimer, ' s', -20, 30, 25, scene.ui)
            clock = scene.addInterval(function(){
              count += miliseconds;
              timeleft = monster.bossTimer - count/1000;
              monster.displayFightTime.destroy();
              monster.displayFightTime = DisplayText.display(timeleft, ' s', -20, 30, 25, scene.ui)
              if(monster.bossTimer == count/1000){
                monster.displayFightTime.destroy();
                monster.bossTime = false;
                normal = false;
                scene.animate(leaveBoss)
                  .then({x: 1000}, 1)
                left = true;
                monster.target.destroy();
                scene.removeInterval(clock);
              }
            }, miliseconds);
        }
      }else{
        monster.displayHealth.destroy();
        if(left){
          monster.bossTime = false;
          mobIndex++;
          if(mobIndex >= monster.monsterImages.length){
            mobIndex = 0;
          }
          if(goldReceiveTracker){
            player.playerBank += monster.monsterGold;
            var goldReceived = scene.addText('+ ' + monster.monsterGold.toFixed(1) + ' gold', {
              x: startX,
              y: startY,
              size: 40
            });
            scene.animate(goldReceived, 'opacity')
              .now({opacity: 1, y: startY - 75},  500 )
              .then({opacity: 0}, 500 );
            player.totalGold.destroy();
            player.goldDisplay.destroy();
            player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, playerScrollView);
            player.goldDisplay = DisplayText.display(player.playerBank, ' ', 150, 130, 35, scene.ui);
          }else{
            goldReceiveTracker = true;
          }
          scene.animate(fightBoss)
            .then({x: 420}, 1);
          monster.target = createMonster(monster, monster.monsterHealth, mobIndex);
        }else{
          goldReceiveTracker = false
          monster.bossTime = true;
          scene.animate(leaveBoss)
            .then({x: 420}, 1);
          monster.target = createMonster(monster, monster.bossHealth, bossIndex);
          effects.radial(monster.target);
          normal = true;

          var miliseconds = 100;
          var count = 0;
          var timeleft = 0;
          monster.displayFightTime = DisplayText.display(monster.bossTimer, ' s', -20, 25, 25, scene.ui)
            clock = scene.addInterval(function(){
              count += miliseconds;
              timeleft = monster.bossTimer - count/1000;
              monster.displayFightTime.destroy();
              monster.displayFightTime = DisplayText.display(timeleft, ' s', -20, 25, 25, scene.ui)
              if(monster.bossTimer == count/1000){
                monster.displayFightTime.destroy();
                monster.bossTime = false;
                normal = false;
                scene.animate(leaveBoss)
                  .then({x: 1000}, 1)
                left = true;
                monster.target.destroy();
                scene.removeInterval(clock);
              }
          }, miliseconds);
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
      effects.shake(background);
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
