import scene;
import .GameUI;
import .Player;
import .DisplayText;


exports = {
  heroBuild: function(ID, level, dmg, cost, bool, view){
    this.ID = ID;
    this.level = level;
    this.damage = dmg;
    this.cost = cost;
    this.exist = bool;
    this.costDisplay = DisplayText.display(this.cost, ' gold', 320, 10, 25, view);
    this.dmgDisplay = DisplayText.display(this.damage, ' DPS', 320, 40, 25, view);
  },

  heroRegister: function(button, hero, player, monster){
    button.registerListener('onDown', function(){
      if(player.playerBank >= hero.cost){
        if(!hero.exist){
          var drag = scene.addActor({url: 'resources/images/littleDragon.png'}, {
            x: 450,
            y: 400,
            width: 100,
            heigt: 100
          });
          hero.exist = true;

          scene.addInterval(function(){
            monster.target.hurt(hero.damage)
            monster.displayHealth.destroy();
            monster.displayHealth = DisplayText.numSlashNum(monster.target.health.toFixed(1), monster.monsterHealth, 130, 80, 'HP');
            monster.hpBar.setValue(monster.target.health/monster.monsterHealth, 100);
          }, 3000)
        }

        player.playerBank -= hero.cost;
        player.totalGold.destroy()
        player.totalGold = DisplayText.display(player.playerBank, ' gold', scene.screen.width - 250, scene.screen.height - 100, 30);
        // Leveling up: increase damage by 2, increase the cost
        hero.level += 1;
        hero.damage += 2;
        hero.cost += hero.cost*50/100
        hero.costDisplay.destroy();
        hero.costDisplay = DisplayText.display(hero.cost, ' gold', -100, 550, 30);
        // Dragon at level 10: Increase hero's damage by 10%
        if(hero.level == 10){
          heroTapDamage += heroTapDamage*10/100;
          damageText.destroy();
          damageText = DisplayText.display(heroTapDamage, ' Tap Damage', -50, scene.screen.height - 100, 30);
        }
        // Dragon at level 25: Increase monster's gold reward by 10%
        if(hero.level == 25){
          monsterGold *= (1 + 10/100)
        }
        // Dragon at level 50: Do something
        if(hero.level == 50){
        }
        // Dragon at level 100: Do something
        if(hero.level == 100){
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