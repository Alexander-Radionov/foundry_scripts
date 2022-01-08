function get_roll_total_from_msg()
{
	let messages = game.messages._source
	let content = messages[messages.length - 1].content
	let el = document.createElement('html');
	el.innerHTML = content
	let tag_inner = el.getElementsByTagName('h4')[0].innerHTML
	let value = parseFloat(tag_inner.substring(0, tag_inner.indexOf('<span')))
	return value
}

function are_more_msgs(len_msgs_before)
{
    if (game.messages._source.length > len_msgs_before) {return 1}
    else {return 0}
}

const asyncInterval = async (msgs_before, ms, triesLeft = 5) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      if (are_more_msgs(msgs_before) > 0) {
        resolve(get_roll_total_from_msg());
        clearInterval(interval);
      } else if (triesLeft <= 1) {
        reject(0);
        clearInterval(interval);
      }
      triesLeft--;
      console.log(`Tries: ${triesLeft}, length: ${game.messages._source.length}`)
    }, ms);
  });
}

function deal_with_condition(save_roll_total, dc, damage_type, attacking_actor, my_item, target_token, alert_name, damage_roll)
{
console.log(`Roll: ${save_roll_total}, DC: ${dc}, damage type: ${damage_type}`)
let flav = `${attacking_actor.name} наносит ${damage_type} урон при ударе ${my_item.name} по ${target_token.actor.name} with \n`
let saved_msg = `${target_token.actor.name} избавляется от <b>${alert_name}</b>!`
if (save_roll_total < dc) {
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
}

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
LMRTFYRoller.requestSavingThrows(target_token.actor, save_ability);
const len_msgs_before = game.messages._source.length
console.log(`Msgs before ${len_msgs_before}`)
asyncInterval(len_msgs_before, 1000).then(resolve => {deal_with_condition(resolve, dc, damage_type, attacking_actor, my_item, target_token, alert_name, damage_roll)})