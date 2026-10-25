/**
 * SlothDesk AI - Bedtime Sanctuary & Micro-Fable Engine
 * Inspired by International Sloth Day (October 20).
 * Generates low-stimulus, slow-cadence bedtime micro-fables and offline ambient soundscape parameters
 * designed to decelerate cognitive velocity and promote restorative sleep.
 */

import { GemmaEngine } from './gemma.js';

export class SanctuaryEngine {
  constructor(gemma = new GemmaEngine()) {
    this.gemma = gemma;
  }

  async generateFable(theme = 'canopyRain', options = {}) {
    const systemContext = `[SYSTEM CONTEXT: You are SlothDesk's Bedtime Sanctuary Storyteller.
Tomorrow is International Sloth Day. Your goal is radical nervous system deceleration.
Write a slow, peaceful, non-stimulating bedtime micro-fable (250-350 words).
Rules:
1. Zero cliffhangers, conflict, or high-urgency verbs.
2. Focus on sensory stillness: soft rainfall on monstera leaves, cool mist drifting across cloud forest branches, a three-toed sloth shifting an inch deeper into the mossy crook of a cecropia tree.
3. Rhythm should feel like slow, rhythmic breathing (6 breaths per minute).
4. End with a quiet, soothing reassurance that tomorrow will wait.]`;

    const userPrompt = `Generate a bedtime micro-fable with theme: "${theme}".`;

    const fallbackFn = () => this.generateHeuristicFable(theme);

    const result = await this.gemma.generate(systemContext, userPrompt, fallbackFn);

    return {
      theme,
      ...result.output,
      meta: {
        engine: result.source,
        model: result.model,
        latencyMs: result.latencyMs
      }
    };
  }

  generateHeuristicFable(theme) {
    if (theme === 'slowRiver') {
      return {
        title: "The River That Forgot How to Hurry",
        setting: "Tortuguero Freshwater Lagoon, Twilight",
        bpmTarget: "42 BPM (Delta Transition)",
        story: `The water in the lagoon moves so slowly that the white water lilies do not even sway. 

Above the bank, nestled in the broad fork of an ancient wild cashew tree, Mateo the sloth settles his weight against a bed of damp green lichen. He does not check the horizon. He does not count the hours before the dawn. The heavy evening air smells of river silt, crushed wild ginger, and the sweet cedar bark drying after the midday shower.

Below him, a freshwater turtle glides across the glassy surface, leaving a wake that disappears before it reaches the reeds. A cool breeze lifts from the water, rustling the underside of the silver trumpet leaves. Mateo blinks once, taking nearly ten heartbeats to let his eyelids meet. 

There are no unread signals in the canopy. No bells, no glowing glass rectangles, no voices asking for one more task before the night settles in. The rainforest has carried on this slow, ancient breathing for millions of years without ever needing to rush. 

Mateo shifts an inch, curling his claws deeper into the warm wood. The world below him can spin as fast as it wants; here, in the cradle of the wild cashew, the only thing required is to let the air drift in, let the shoulders fall, and let the quiet take over. 

Sleep is not something you chase. It is simply what happens when you stop running.`
      };
    }

    if (theme === 'highlandMoss') {
      return {
        title: "The Glade Above the Clouds",
        setting: "Cerro de la Muerte Highland Oak Forest, 3,400m",
        bpmTarget: "48 BPM (Resting Parasympathetic)",
        story: `High on the mountain ridge, the clouds do not pass overhead—they walk through the trees.

The dwarf oaks are draped in Spanish moss that hangs like silver lace, catching the microscopic mist until every strand gleams in the indigo twilight. In the sheltered crook of an old gnarled branch, Lucia rests. Her fur is tinted with gentle wild algae that smells like mountain rain on cold stone.

A droplet forms on the tip of a bromeliad leaf. It gathers slowly, holding the purple light of the vanished sun, before tumbling soundlessly onto the deep moss carpet below. 

The cold mountain air is clean and silent. Lucia tucks her chin against her chest, letting the thick canopy shield her from the wind. She knows with absolute biological certainty that moving slowly is not a deficiency; it is the highest form of endurance. The swiftest hunters tire and fade, but the creature that knows how to wait simply endures.

Breathe in the cool pine scent. Exhale the residual tension in your neck and hands. The day has finished its work, and the mountain has closed its gates until morning.`
      };
    }

    // Default: canopyRain
    return {
      title: "The First Rain of the Monteverde Canopy",
      setting: "Cloud Forest Reserve, Costa Rica",
      bpmTarget: "46 BPM (Deep Rest)",
      story: `The first drop lands with a soft, hollow tap against the broad leaf of a wild monstera vine.

Three hundred feet up in the dense green crown of an ironwood tree, Barnaby does not flinch. He has spent the entire afternoon watching a family of emerald hummingbirds forage among the orchid blossoms, his breath as steady and unhurried as the drifting mountain fog.

Now the rain arrives in earnest—not as a violent storm, but as a steady, continuous murmur of grey silk falling through twenty layers of leaves. The sound fills every corner of the canopy: shhh-shhh-shhh, washing away the heat of the afternoon, softening the rough edges of the bark, dampening the forest floor far below.

Barnaby draws his front paws together and tucks his nose into his chest. His thick coat repels the water effortlessly, turning each drop into a harmless diamond that rolls off into the moss. 

Every deadline that felt so urgent twelve hours ago has evaporated into the cool green gloom. The forest does not demand answers. It only asks you to listen to the water strike the leaves, to feel the weight of your own body resting against whatever holds you, and to let go of the need to be anywhere else.

Rest now. The canopy will still be here when you wake.`
    };
  }
}
