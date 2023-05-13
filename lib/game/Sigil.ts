export enum Sigil {
    Sprinter = 'strafe',
    DeathTouch = 'deathtouch',
    Fledgling = 'evolve',
    Hoarder = 'tutor',
    Burrower = 'whackamole',
    CopyOnPlay = 'drawcopy',
    Waterborne = 'submerge',
    KrakenWaterborne = 'subergesquid',
    Airborne = 'flying',
    BlockAir = 'reach',
    Unkillable = 'drawcopyondeath',
    Sharp = 'sharp',
    Hefty = 'strafepush',
    Guardian = 'guarddog',
    CancelAttack = 'preventattack',
    TwoHit = 'splitstrike',
    ThreeHit = 'tristrike',
    Frozen = 'icecube',
    // Leader = 'leader',
    // Stinky = 'stinky',
    Trap = 'steeltrap',
    // Handy = 'handy',
    Detonator = 'explodeondeath',
    Sentry = 'sentry',
    Looter = 'loot',

    // SquirrelShedder = 'squirrelstrafe',
    // Dam = 'dam',
    // DrawRabbit = 'drawrabbits',
    // DrawBee = 'drawbees',
    // DrawAnt = 'drawants',
    ManyLives = 'sacrificial',
    ThreeBlood = 'tripleblood',

    BoneKing = 'quadruplebones',
    // CorpseEater = 'playondeath',
    BoneDigger = 'bonedigger',
    Brittle = 'brittle',
    SkeletonCrew = 'skeletonstrafe',
    DoubleDeath = 'doubledeath',

    GreenMox = 'gaingem_green',
    BlueMox = 'gaingem_blue',
    OrangeMox = 'gaingem_orange',
    BuffMox = 'buffgems',
    DropOrangeMox = 'droprubyondeath',
    MoxDraw = 'gemsdraw',
    NeedsMox = 'gemdependant',
    AllMox = 'gaingem_all',

    AttackConduit = 'conduitbuffattack',
    SpawnConduit = 'conduitspawner',
    NullConduit = 'conduit',
    EnergyConduit = 'conduitenergy',
    BatteryBearer = 'gainbattery',
    BombSpewer = 'bombspawner',

    PowerDiceForBones = 'activated_dicerollenergy',
    StatsForBones = 'activated_statsup',
    SkeletonForBones = 'activated_drawskeleton',
    DamageForEnergy = 'activated_dealdamage',
    CardsForBlueMox = 'activated_sacrificedraw',
    StatsForEnergy = 'activated_statsupenergy',
    BonesForEnergy = 'activated_energytobones',
}

const buttonSigils = new Set([
    Sigil.PowerDiceForBones,
    Sigil.StatsForBones,
    Sigil.SkeletonForBones,
    Sigil.DamageForEnergy,
    Sigil.CardsForBlueMox,
    Sigil.StatsForEnergy,
    Sigil.BonesForEnergy,
]);

export function isButtonSigil(sigil: Sigil) {
    return buttonSigils.has(sigil);
}
