//attack_roll = item.rollAttack({'fastforward': true})
///damage_roll = item.rollDamage({'fastforward': true})

let target_token = Array.from(game.user.targets)[0]
//target_token.actor.data.data.saves.dex.roll()
let turn_id = game.combat.getCombatantByToken(target_token.data._id)._id
let combat_id = game.combat.data._id
let alert_name = 'Flaming'
damage_formula = '1d4'
game.cub.addCondition(alert_name, target_token)
//console.log('Turn id: ${turnId}')
//ChatMessage.create({user: game.user._id, speaker: ChatMessage.getSpeaker({token: actor}),
//content: `IM ${Object.getOwnPropertyNames(actor)}`})
//new MidiQOL.DamageOnlyWorkflow(game.user.character._id, target_token._id, damage_roll.total, "slashing", [target_token], damage_roll, { flavor: `(Slashing)`, itemCardId: item.itemCardId});
let alertData = {
    id: null,
    name: alert_name,
    combatId: combat_id,
    createdRound: game.combat.data.round,
    round: 0,
    roundAbsolute: false,
    turnId: turn_id,
    endOfTurn: false,
    repeating: {'frequency': 1, 'expire': 20, 'expireAbsolute': false},
    label: 'flaming',
    message: null,
    recipientIds: [],
    macro: 'turn_damage',
    args: [actor, item, "flame", 12, alert_name, combat_id, 'dex', damage_formula],
    userId: game.userId,
}
TurnAlert.create(alertData);