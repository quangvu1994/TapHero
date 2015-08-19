import scene;
import .GameUI;
import .Player;
import .DisplayText;
import .SkillSetUp;


exports = {
  heroBuild: function(ID, dmg, cost, img, position){
    this.ID = ID;
    this.level = 0;
    this.damage = dmg;
    this.cost = cost;
    this.exist = false;
    this.image = img;
    this.posX = position[1];
    this.posY = position[2];
    this.keyPos = position[0];
    this.costDisplay = DisplayText.display(this.cost, ' gold', 320, this.keyPos, 25, heroScrollView);
    this.dmgDisplay = DisplayText.display(this.damage, ' DPS', 320, this.keyPos+30, 25, heroScrollView);
    // Need to display the hero level too
  },

  heroRegister: function(button, hero, player, monster, skillSet){
    button.registerListener('onDown', function(){
      if(player.playerBank >= hero.cost){
        if(!hero.exist){
          var drag = scene.addActor({url: hero.image}, {
            x: hero.posX,
            y: hero.posY,
            width: 100,
            heigt: 100
          });
          hero.exist = true;

          scene.addInterval(function(){
            monster.target.hurt(hero.damage);
            monster.displayHealth.destroy();
            if(monster.bossTime){
              monster.displayHealth = DisplayText.numSlashNum(monster.target.health.toFixed(1), monster.bossHealth, 130, 80, 'HP');
              monster.hpBar.setValue(monster.target.health/monster.bossHealth, 100);
            }else{
              monster.displayHealth = DisplayText.numSlashNum(monster.target.health.toFixed(1), monster.monsterHealth, 130, 80, 'HP');
              monster.hpBar.setValue(monster.target.health/monster.monsterHealth, 100);
              };
          }, 3000);
        }

        player.playerBank -= hero.cost;
        player.totalGold.destroy();
        player.goldDisplay.destroy();
        player.totalGold = DisplayText.display(player.playerBank, ' gold', 320, 0, 25, playerScrollView);
        player.goldDisplay = DisplayText.display(player.playerBank, ' ', 150, 130, 35, scene.ui);
        // Leveling up: increase damage by 2, increase the cost
        hero.level += 1;
        hero.damage += 2;
        hero.cost += hero.cost*50/100
        hero.costDisplay.destroy();
        hero.dmgDisplay.destroy();
        hero.costDisplay = DisplayText.display(hero.cost, ' gold', 320, hero.keyPos, 25, heroScrollView);
        hero.dmgDisplay = DisplayText.display(hero.damage, ' DPS', 320, hero.keyPos+30, 25, heroScrollView);
        if(hero.level == 10){
          SkillSetUp.skillBuilder(skillSet[0], player, hero)
        }
        if(hero.level == 25){
          SkillSetUp.skillBuilder(skillSet[1], player, hero)
        }
        if(hero.level == 50){
          SkillSetUp.skillBuilder(skillSet[2], player, hero)
        }
        if(hero.level == 100){
          SkillSetUp.skillBuilder(skillSet[3], player, hero)
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
      };
    });
  }
}