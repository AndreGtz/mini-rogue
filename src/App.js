import React, { useState } from 'react';
import styled from 'styled-components';

// styles
const Bar = styled.div`
  background-color: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;

  .name {
    font-weight: bold;
  }

  .button {
    border: 1px solid #333;
    border-radius: 5px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:active {
      background-color: #ccc;
    }
  }
`;

const Spells = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  div {
    padding-left: 5px;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  min-height: 80px;
  background-color: #ccc;
  margin-bottom: 5px;
`;

const Dice = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 80px;
  background-color: #fff;
  color: #333;
  margin-bottom: 5px;
  div {
    border: 1px solid #333;
    border-radius: 5px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:active {
      background-color: #ccc;
    }
  }
`;

const Spacer = styled.div`
  width: 100%;
  height: 80px;
`;

const App = () => {
  const [xp, setXp] = useState(0);
  const [gold, setGold] = useState(3);
  const [hp ,setHp] = useState(5);
  const [armor, setArmor] = useState(0);
  const [food, setFood] = useState(6);
  const [spells, setSpells] = useState({
    fire: 0,
    ice: 0,
    poison: 0,
    heal: 0,
  });
  const [area, setArea] = useState(0);
  const [monsterHp, setMonsterHp] = useState(0);
  const [dungeonFloor, setDungeonFloor] = useState([]);
  const [dice, setDice] = useState([1,1,1,1]);


  const DungeonLevels = [1,1,1,2,2,3,3,3,4,4,4,5,5,5,5];
  const BossAreas = [2, 4, 7, 10, 14]
  const Cards = [{
    name: 'Event',
    info: ['Skill check: 1d6 <= Rank',
      '1: +1 food',
      '2: +2 gold',
      '3: +2 hp',
      '4: +2 xp',
      '5: +1 armor',
      '6: monster dmg: lvlx2 xp: 2',
    ],
    activated: false,
  },{
    name: 'Trap',
    info: ['Skill check: 1d6 <= Rank',
      '1: -1 food',
      '2: -1 armor',
      '3: -1 gold',
      '4: -1 hp',
      '5: -1 xp',
      '6: pit: -2hp, fall area below',
    ],
    activated: false,
  },{
    name: 'Monster',
    info: ['Hp: Dungeon Area + 1d6',
      '1 undead soldier dmg: 2 xp: 1',
      '2 skeleton dmg: 4 xp: 1',
      '3 undead knight dmg: 6 xp: 2',
      '4 serpent knight dmg: 8 xp: 2',
      '5 ogs sanctum guard dmg: 10 xp: 3',
    ],
    activated: false,
  },{
    name: 'Treasure',
    info: ['1gp no monster defeated',
      '2gp if a monster defeated',
      'roll 1d6: 5+ roll again for item',
      '1: +1 armor',
      '2: fireball spell 8dmg',
      '3: +2 xp',
      '4: Ice',
      '5: Poison',
      '6: Heal',
    ],
    activated: false,
  },{
    name: 'Resting',
    info: ['Choose 1',
      '+1 xp',
      '+1 food',
      '+2 hp',
    ],
    activated: false,
  },{
    name: 'Merchant',
    info: ['Buy',
      '1gp +1 food',
      '1gp +1 hp',
      '3gp +3 hp',
      '6gp +1 armor',
      '8gp +1 spell',
      'Sell',
      '3gp 1 armor',
      '4gp any 1 spell',
    ],
    activated: false,
  }];


  const getRank = () => {
    return Math.floor(xp/6)+1;
  };

  const rollXd6 = (numberOfDice) => {
    const result = {
      dice: [],
      total: 0,
    };
    for (let i = 0; i < numberOfDice; i += 1) {
      const roll = Math.round(Math.random() * 5) + 1
      result.dice.push(roll);
      result.total += roll;
    }
    return result;
  };

  const genEncounter = () => {
    setMonsterHp(area + rollXd6(1).total);
  };

  const genDungeonFloor = () => {
    const newFloor = [];
    const floorCards = Cards.slice(0);
    while (floorCards.length > 0) {
      const index = Math.round(Math.random() * (floorCards.length - 1));
      newFloor.push(floorCards[index]);
      floorCards.splice(index, 1);
    }
    newFloor[0].activated = true;
    setDungeonFloor(newFloor);
  };

  const activateArea = (area) => {
    const newFloor = dungeonFloor.slice(0);
    newFloor[area].activated = true;
    setDungeonFloor(newFloor);
  };

  const rollDice = (index) => {
    const res = rollXd6(1);
    const newSet = dice.splice(0);
    newSet[index] = res.total;
    setDice(newSet);
  };

  const nextFloor = () => {
    setArea(area + 1);
    genDungeonFloor();
  };

  const setBossHp = () => {
    setMonsterHp((DungeonLevels[area] * 5) + 5);
  };


  return (
    <div>
      <Bar>
        <Stat>
          <div className="name">
            HP:
          </div>
          <div className="button" onClick={() => {setHp(hp - 1)}}>
            -
          </div>
          <div className="stat">
            {hp}
          </div>
          <div className="button" onClick={() => { setHp(hp + 1) }}>
            +
          </div>
        </Stat>
        <Stat>
          <div className="name">
            XP:
          </div>
          <div className="button" onClick={() => { setXp(xp - 1) }}>
            -
          </div>
          <div className="stat">
            {xp}
          </div>
          <div className="button" onClick={() => { setXp(xp + 1) }}>
            +
          </div>
        </Stat>
        <Stat>
          <div className="name">
            GP:
          </div>
          <div className="button" onClick={() => { setGold(gold - 1) }}>
            -
          </div>
          <div className="stat">
            {gold}
          </div>
          <div className="button" onClick={() => { setGold(gold + 1) }}>
            +
          </div>
        </Stat>
        <Stat>
          <div className="name">
            Armor:
          </div>
          <div className="button" onClick={() => { setArmor(armor - 1) }}>
            -
          </div>
          <div className="stat">
            {armor}
          </div>
          <div className="button" onClick={() => { setArmor(armor + 1) }}>
            +
          </div>
        </Stat>
        <Stat>
          <div className="name">
            Food:
          </div>
          <div className="button" onClick={() => { setFood(food - 1) }}>
            -
          </div>
          <div className="stat">
            {food}
          </div>
          <div className="button" onClick={() => { setFood(food + 1) }}>
            +
          </div>
        </Stat>
        <div>
          {`Area: ${area} Level: ${DungeonLevels[area]} Rank: ${getRank()}`}
        </div>
        <Spells>
          <Stat>
            <div className="name">
              Fire:
          </div>
            <div className="button" onClick={() => { setSpells({...spells, fire: spells.fire - 1}) }}>
              -
          </div>
            <div className="stat">
              {spells.fire}
            </div>
            <div className="button" onClick={() => { setSpells({ ...spells, fire: spells.fire + 1 }) }}>
              +
          </div>
          </Stat>
          <Stat>
            <div className="name">
              Ice:
          </div>
            <div className="button" onClick={() => { setSpells({ ...spells, ice: spells.ice - 1 }) }}>
              -
          </div>
            <div className="stat">
              {spells.ice}
            </div>
            <div className="button" onClick={() => { setSpells({ ...spells, ice: spells.ice + 1 }) }}>
              +
          </div>
          </Stat>
          <Stat>
            <div className="name">
              Poison:
          </div>
            <div className="button" onClick={() => { setSpells({ ...spells, poison: spells.poison - 1 }) }}>
              -
          </div>
            <div className="stat">
              {spells.poison}
            </div>
            <div className="button" onClick={() => { setSpells({ ...spells, poison: spells.poison + 1 }) }}>
              +
          </div>
          </Stat>
          <Stat>
            <div className="name">
              Heal:
          </div>
            <div className="button" onClick={() => { setSpells({ ...spells, heal: spells.heal - 1 }) }}>
              -
          </div>
            <div className="stat">
              {spells.heal}
            </div>
            <div className="button" onClick={() => { setSpells({ ...spells, heal: spells.heal + 1 }) }}>
              +
          </div>
          </Stat>
        </Spells>
        <Stat>
          <div className="name">
            Monster:
          </div>
          <div className="button" onClick={() => { setMonsterHp(monsterHp - 1)}}>
            -
          </div>
          <div className="stat">
            {monsterHp}
          </div>
          <div className="button" onClick={() => { genEncounter() }}>
            Gen
          </div>
        </Stat>
      </Bar>
      {dungeonFloor.map((floor, index) => (
        <Card key={index} onClick={() => {activateArea(index)}}>
          {floor.activated && floor.name}
          {floor.activated && floor.info.map((p, i) => <p key={`${index}+${i}`}>{p}</p>)}
        </Card>
      ))}
      {BossAreas.includes(area) && (
        <Card onClick={setBossHp}>
          <p>Boss Monster</p>
          <p>1. Undead Giant hp:10 dmg:3 reward: 2gp + 2xp + item</p>
          <p>2. Undead Giant hp:15 dmg:5 reward: 2gp + 3xp + item</p>
          <p>3. Undead Giant hp:20 dmg:7 reward: 3gp + 4xp + item</p>
          <p>4. Undead Giant hp:25 dmg:9 reward: 3gp + 5xp + item</p>
          <p>5. Undead Giant hp:30 dmg:12 reward: Og's blood</p>
        </Card>
      )}
      <Card onClick={() => nextFloor()}>
        Gen Floor
      </Card>
      <Spacer />
      <Dice>
        {dice.map((die, index) => (
          <div key={index} onClick={() => rollDice(index)}>
            {die}
          </div>
        ))}
      </Dice>
    </div>
  );
}

export default App;
