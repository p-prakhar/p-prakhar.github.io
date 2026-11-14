---
# Written by Jekyll from _data/intent.yml. Set the Play Store link there, not here.
---
window.INTENT_PLAY_URL = {{ site.data.intent.play_url | default: "" | strip | jsonify }};
