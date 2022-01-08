let attacking_actor = args[0]
let my_item = args[1]
let target_token = Array.from(game.user.targets)[0]
let damage_type = args[2]
let dc = args[3]
let alert_name = args[4]
let combat_id = args[5]
let save_ability = args[6]
let damage_formula = args[7]
let damage_roll = new Roll(damage_formula).roll()
console.log(`Save ability: ${save_ability}`)
//LMRTFYRoller.requestSavingThrows(target_token.actor, "dex");

//messages = game.ChatLog.collection
//data = game.data
//messages = game.messages._source
//last_message = messages[messages.length - 1]
//save_value = last_message.roll.total
//console.log(`inner_script ${Object.getOwnPropertyNames(game.messages._source)}, type ${game.messages._source}`)
let save_modifier = 0

if (save_ability == 'dex') 
{
    console.log(`Reached dex branch`)
    save_modifier = target_token.actor.data.data.abilities.dex.save
	console.log(`Modifier: ${target_token.actor.data.data.abilities.dex.save}, ${save_modifier}`)
}

if (save_ability == 'con') 
{
    console.log(`Reached CON branch`)
    save_modifier = target_token.actor.data.data.abilities.con.save
	console.log(`Modifier: ${target_token.actor.data.data.abilities.con.save}, ${save_modifier}`)
}

let save_roll = new Roll(`d20+${save_modifier}`).roll()
console.log(`Roll: ${save_roll.total}, DC: ${dc}, damage type: ${damage_type}`)
let flav = `${attacking_actor.name} наносит ${damage_type} урон при ударе ${my_item.name} по ${target_token.actor.name} with \n`
let saved_msg = `${target_token.actor.name} избавляется от <b>${alert_name}</b>!`
if (save_roll.total < dc) {
new MidiQOL.DamageOnlyWorkflow(attacking_actor._id, attacking_actor.token._id, damage_roll.total, damage_type, [target_token], damage_roll, {flavor: flav, itemCardId: my_item.itemCardId});
}
else {
   if (game.cub.hasCondition(alert_name, target_token)) {game.cub.removeCondition(alert_name, target_token)}
   let alert = TurnAlert.getAlertByName(alert_name, combat_id)
   console.log(`Alert id: ${alert.id}, combat: ${alert.combatId}, name: ${alert.name}`)
   TurnAlert.delete(alert.combatId, alert.id)
   ChatMessage.create({user: null, speaker: ChatMessage.getSpeaker({token: target_token}), 
                       content:saved_msg});
}