class Component{
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.state = options.state;
  }

  setState(state){
    this.state = state;
  }

  static getRandomNumberBetween(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min)
  }

  static formatNumber(number){
    return (number > 0) ? number : 0;
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
    this.state = 'started';
    this.attacker = this.getFirstAttacker(this.players[0], this.players[1])
    this.defender = (this.players[0] === this.attacker) ? this.players[1] : this.players[0];

    console.info(
      `
      New game!
      ${this.attacker.hero.name} health: ${this.attacker.hero.health}.
      ${this.defender.hero.name} health: ${this.defender.hero.health}.
      `
    );

    this.fight();

    const attack = setInterval(() => {
      if (this.attacker.hero.health <= 0 || this.defender.hero.health <= 0) {
        this.gameOver(this.attacker, this.defender);
        this.getWinner();
        this.stop(attack);
      }else{
        if(this.getRounds() === 19){
          this.gameOver(this.attacker, this.defender);
          this.getWinner();
          this.stop(attack);
          return;
        }
        this.fight();
      }
    }, 1000);



  }

  stop(event){
    this.state = 'stoped';
    clearInterval(event);
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
    const round = this.getRounds();
    const attack = new Attack({id: 'sdadsasd'});
    console.warn(`Round: ${round}`);
    attack.attack(this.attacker, this.defender);
    this.switchTurns(this.attacker, this.defender);
    this.addRound();
  }


  addRound(){
    return this.rounds += 1;
  }

  getRounds(){
    return this.rounds + 1;
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
    console.warn(`Game over, ${this.winner.name} won in ${this.rounds} rounds!`);
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
    this.currentSkill = '';
  }
}

class Attack extends Component{
  constructor(options) {
    super(options);
  }

  static getDamage(strenght, defence){
    return Math.round(strenght - defence);
  }

  static divideDamage(damage, divider){
    return Math.round(damage / divider);
  }

  static multiplyDamage(damage, multiplyer){
    return Math.round(damage * multiplyer);
  }

  attack(attacker, defender){
    this.state = 'in combat';
    const damage = Attack.getDamage(attacker.hero.strenght, defender.hero.defence);
    const attackerLuck = Component.getRandomNumberBetween(0, attacker.hero.luck);
    const defenderLuck = Component.getRandomNumberBetween(0, defender.hero.luck);
    const defenderHealth = defender.hero.health;

    let skillName = attacker.hero.skills[0]['name'];
    let skillChance = attacker.hero.skills[0]['chanceToHit'];
    const rule = Math.floor(Math.random() * 100);

    console.warn(`${attacker.hero.name} turn to attack. ${defender.hero.name} is defending!`);

    console.info(
      `
      ${attacker.hero.name} health: ${attacker.hero.health}.
      ${defender.hero.name} health: ${defender.hero.health}.
      `
    );

    //console.log(`Attacker chance: ${attackerChance}, Defender chance: ${defenderChance}`);

    if(attackerLuck < defenderLuck){
      //hit was missed
      console.info(
        `
        ${attacker.hero.name} hits ${defender.hero.name} for ${damage} damage with ${skillName}.
        ${defender.hero.name} got lucky, ${attacker.hero.name} missed with ${skillName}!
        ${defender.hero.name} health: ${Component.formatNumber(defenderHealth - 0)}
        `
      );
      return defender.hero.health = Component.formatNumber(defenderHealth - 0);
    }

    if(defender.hero.name === 'Orderus'){
      skillChance = defender.hero.skills[2]['chanceToHit'];
      if(rule < skillChance){
        skillName = defender.hero.skills[2]['name'];
        console.info(
          `
          ${attacker.hero.name} hits ${defender.hero.name} for ${damage} damage with ${attacker.hero.skills[0]['name']}.
          ${defender.hero.name} used ${skillName}, reduced damage by ${Component.formatNumber(Attack.divideDamage(damage, defender.hero.skills[2]['damage']))}.
          ${defender.hero.name} health: ${Component.formatNumber(defenderHealth - Attack.divideDamage(damage, defender.hero.skills[2]['damage']))}
          `
        );
        //hit blocked, damage divided by defender skill damage
        return defender.hero.health = Component.formatNumber(defenderHealth - Attack.divideDamage(damage, defender.hero.skills[2]['damage']));
      }
    }

    if(attacker.hero.name === 'Orderus'){
      skillChance = attacker.hero.skills[1]['chanceToHit'];
      if(rule < skillChance){
        skillName = attacker.hero.skills[1]['name'];
        console.info(
          `
          ${attacker.hero.name} got lucky and hits ${defender.hero.name} for ${Component.formatNumber(Attack.multiplyDamage(damage, attacker.hero.skills[1]['damage']))} damage with ${skillName}.
          ${defender.hero.name} health: ${Component.formatNumber(defenderHealth - Attack.multiplyDamage(damage, attacker.hero.skills[1]['damage']))}
          `
        );
        //hit is doubled
        return defender.hero.health = Component.formatNumber(defenderHealth - Attack.multiplyDamage(damage, attacker.hero.skills[1]['damage']));
      }
    }

    console.info(
      `
      ${attacker.hero.name} hits ${defender.hero.name} for ${damage} damage with ${skillName}.
      ${defender.hero.name} health: ${Component.formatNumber(defenderHealth - damage)}
      `
    );
    return defender.hero.health = Component.formatNumber(defenderHealth - damage);
  }

  setSkill(skill){
    return this.currentSkill = skill;
  }



  getCurrentSkill(){
    return this.currentSkill
  }

  getAttacker() {
    return this.attacker;
  }

  getDefender() {
    return this.defender;
  }
}

class Skill extends Attack{
  constructor(options) {
    super(options);
    this.damage = options.damage;
    this.chanceToHit = options.chanceToHit;
  }

  getSkillName(){
    return this.name;
  }
}
