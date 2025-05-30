# Monster Hunter Recommendation API

## Gemini AI Integration Endpoints

### Generate Weapon Recommendation
**POST** `/recommendations/generate`

```json
{
  "userId": 1,
  "monsterId": 1,
  "preferences": {
    "playstyle": "aggressive",
    "experience": "intermediate",
    "preferredWeaponTypes": ["sword", "bow"]
  }
}