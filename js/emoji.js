/* ============================================================
   DES2026 — Emoji image map
   All emojis must be rendered as <img> from ./emojis/*.svg
   Never use Unicode emoji characters in rendered HTML.
   ============================================================ */

/* Maps Unicode emoji → SVG filename (without extension) in ./emojis/ */
const EMOJI = {
  '👁':'eye', '👋':'wave', '🎵':'music', '🎬':'film',
  '🎮':'game', '🏏':'cricket', '💬':'chat', '📚':'books',
  '📞':'phone', '📹':'video', '🔒':'lock', '🔤':'text-abc',
  '🔴':'red-circle', '🎤':'mic', '🎉':'party', '🌱':'seedling',
  '🌹':'rose', '🌸':'blossom', '🌿':'herb', '🙏':'prayer',
  '😄':'smile', '😅':'sweat-smile', '🍎':'apple', '🍊':'orange',
  '🍋':'lemon', '🍇':'grapes', '🍓':'strawberry', '🍑':'peach',
  '🥝':'kiwi', '🍍':'pineapple', '🍲':'pot', '⭕':'circle-o',
  '🟡':'yellow-circle', '🃏':'joker', '✨':'sparkles', '🌅':'sunrise',
};

/* Returns an <img> tag for a named emoji (use EMOJI values as the key) */
function ej(name, size) {
  const s = size || '1.1em';
  return `<img src="./emojis/${name}.svg" class="emoji-img" alt="" style="width:${s};height:${s};vertical-align:-0.2em;display:inline-block;">`;
}

/* Replaces all known Unicode emoji in a text string with <img> tags.
   Use this when rendering any user-visible text that may contain emoji. */
function renderEmoji(text) {
  if (!text) return text;
  let out = text;
  for (const [char, name] of Object.entries(EMOJI)) {
    if (out.includes(char)) out = out.split(char).join(ej(name));
  }
  return out;
}
