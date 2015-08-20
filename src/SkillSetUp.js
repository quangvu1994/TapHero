import scene;
import .Player;

exports = {
  playerSkillCooldown: function(button, cdTime){
    button.disabled = true;
    var cooldownTime = cdTime;
    var miliseconds = 100;
    var count = 0;
    var clock = scene.addInterval(function(){
      count += miliseconds;
      if(count/1000 == cooldownTime){
        button.disabled = false;
        scene.removeInterval(clock);
      }
    }, miliseconds);
  },

  skillBuilder: function(skillNum, player, hero){
    switch(skillNum){
      // Increase heroTapDamage by 10%
      case 1:
        player.heroTapDamage *= (1+10/100)
        break;
      // Increase All damage by 10%
      case 2:
        break;
      // Increase All damage by 20%
      case 3:
        break;
      // Increase this hero's damage by 100%
      case 4:
        hero.damage *= (1+100/100)
        break;
      // Increase this hero's damage by 700%
      case 5:
        hero.damage *= (1+700/100)
        break;
      // Increase this hero's damage by 800%
      case 6:
        hero.damage *= (1+800/100)
        break;
      // Increase this hero's damage by 1000%
      case 7:
        hero.damage *= (1+1000/100)
        break;
      //Increase gold drop amount
      case 8:
        break;
      default:
        break;
    }
  },
}