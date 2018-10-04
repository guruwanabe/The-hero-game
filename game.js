class Component{
 constructor(options) {
   this.id = options.id;
   this.name = options.name;
   this.state = (options.state || 'not running');
 }

 setState(state){
   this.state = state;
 }

 static getRandomNumberBetween(min, max) {
     return Math.floor(Math.random()*(max-min+1)+min)
 }
 static formatNumber(number){
   return number > 0 ? number : 0;
 }
}

class Game extends Component{
	constructor(options) {
   	super(options);

	this.players = options.players;
    this.attacker = null;
    this.defender = null;
    this.winner = null;
    this.rounds = 0;
	}

  //stop, pause, exit
	start() {
   	let attack;
	this.state = 'running';
    this.attacker = this.getFirstAttacker(
      this.players[0],
      this.players[1]
    )
    this.defender = this.players[0];

    attack = setInterval(() => {
      if (this.attacker.hero.health <= 0 || this.defender.hero.health <= 0) {
          this.gameOver(this.attacker, this.defender);
          this.getWinner();
          this.stop(attack);
        }else{
					this.fight();
        }
      }, 1000);

      if(this.rounds === 20){
        this.stop(attack);
      }
    }

  stop(attack){
    this.state = 'not in combat';
    clearInterval(attack);
    this.rounds = 0;
  }

	getFirstAttacker(player1, player2){
    let rule = Math.min(player1.hero.speed, player2.hero.speed);
   	let attacker;
    if(player1.hero.speed === player2.hero.speed){
      rule = Math.min(player1.hero.luck, player2.hero.luck);
      //set player1 as default if luck is equal
      if (player1.hero.luck === player2.hero.luck) {
        return attacker = this.player1
      }

      this.players.filter((player) => {
        if(player.hero.speed > rule){
          attacker = player
        	return attacker;
        }
      });
    }else{
    	this.players.filter((player) => {
        if(player.hero.speed > rule){
          attacker = player
        	return attacker;
        }
      });
    }
    return attacker;
  }


  fight(){
   	Hero.attack(this.attacker, this.defender);
    this.switchTurns(this.attacker, this.defender);
    this.addRound();
  }


  addRound(){
  	return this.rounds += 1;
  }

  switchTurns(attacker, defender){
  	this.attacker = defender;
    this.defender = attacker;
  }

  gameOver(attacker, defender){
    const winner = (attacker.hero.health > defender.hero.health) ? attacker : defender;
    this.winner = winner;
    this.state = 'stoped'
  	return this.winner;
  }

  getWinner(){
    console.log(`${this.winner.name} won in ${this.rounds} rounds!`);
    return this.winner;
  }
}

class Player extends Component{
	constructor(options) {
    	super(options);
    	this.hero = options.hero;
	}
}

class Hero extends Component{
	constructor(options) {
		super(options);
		this.health = options.health || 100;
		this.strenght = options.strenght || 100;
		this.defence = options.defence || 100;
		this.speed = options.speed || 100;
		this.luck = options.luck || 100;
		this.skills = options.skills || [];
	}

  static attack(attacker, defender){
    this.state = 'in combat';
    const damage = Skill.getDamage(attacker.hero.strenght, defender.hero.defence);
    const attackerChance = Component.getRandomNumberBetween(1, attacker.hero.luck);
    const defenderChance = Component.getRandomNumberBetween(1, defender.hero.luck);

    console.log(`${attacker.hero.name} turn to attack, ${defender.hero.name} is defending!`);
    //console.log(`Attacker chance: ${attackerChance}, Defender chance: ${defenderChance}`);

    if(attackerChance < defenderChance){
      console.log(`${defender.hero.name} got lucky, ${attacker.hero.name} missed!`);
      return defender.hero.health = Component.formatNumber(defender.hero.health - 0);; //hit was missed
    }else if ((defenderChance < attackerChance) && attacker.hero.name === 'Orderus') {
      console.log(`${attacker.hero.name} got lucky and hits ${defender.hero.name} for ${(damage * 2)} damage (double)`);
      return defender.hero.health = Component.formatNumber(defender.hero.health - (damage * 2)); //hit is doubled
    }

    console.log(`${attacker.hero.name} hits ${defender.hero.name} for ${damage} damage`);
    return defender.hero.health = Component.formatNumber(defender.hero.health - damage);
  }

}

class Skill extends Component{
	constructor(options) {
		super(options);
		this.damage = options.damage;
		this.chanceToHit = options.chanceToHit;
	}

  static getDamage(strenght, defence){
    return Math.floor(strenght - defence);
  }

  static getChanceToHit(){
    return
  }

}

const id =  Math.random().toString(36).substring(7);
const orderus = {
  id: `hero_${id}`,
  name:'Orderus',
  state: 'notincombat',
  health: Component.getRandomNumberBetween(70, 100),
  strenght: Component.getRandomNumberBetween(70, 80),
  defence: Component.getRandomNumberBetween(45, 55),
  speed: Component.getRandomNumberBetween(40, 50),
  luck: Component.getRandomNumberBetween(10, 30),
  skills: [
    new Skill(
      {
        id: `skill_${id}`,
        name:'Rapid Strikes',
        damage: 2,
        chanceToHit: Component.getRandomNumberBetween(10, 100)
      }
    ),
    new Skill(
      {
        id: `skill_${id}`,
        name:'Magic shield',
        damage: 1,
        chanceToHit: 100
      }
    )
  ]
};


const beast = {
  id: `hero_${id}`,
  name:'Beast',
  state: 'notincombat',
  health: Component.getRandomNumberBetween(60, 90),
  strenght: Component.getRandomNumberBetween(60, 90),
  defence: Component.getRandomNumberBetween(40, 60),
  speed: Component.getRandomNumberBetween(40, 60),
  luck: Component.getRandomNumberBetween(25, 40),
  skills: [
  	new Skill(
      {
        id: `skill_${id}`,
        name:'Attack',
        damage: 1,
        chanceToHit: 100
      }
    )
  ]
};


const game = new Game({
  name:'The hero game',
  id: id,
	players: [
		new Player(
      	{
          id: `player_${id}`,
          name:'Player1',
          state: 'notincombat',
          hero: new Hero(orderus)
        }
		),
		new Player(
      {
        id: `player_${id}`,
        name:'Computer',
        state: 'notincombat',
				hero: new Hero(beast)
      }
    )
	],
	state: 'started'
});

game.start();
console.log(game);
