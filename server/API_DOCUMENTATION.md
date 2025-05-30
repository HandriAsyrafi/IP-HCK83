# Monster Hunter Recommendation API

A RESTful API for Monster Hunter weapon recommendations powered by Google's Gemini AI.

## Base URL

```
http://localhost:3000
```

## Authentication

Some endpoints require authentication using Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Models

### User

- id: integer (primary key)
- email: string (required, unique)
- password: string (required)
- name: string

### Monster

- id: integer (primary key)
- name: string (required)
- element: string
- weakness: string
- habitat: string
- description: text

### Weapon

- id: integer (primary key)
- name: string (required)
- type: string (required)
- element: string
- damage: integer
- description: text

### Recommendation

- id: integer (primary key)
- userId: integer (foreign key)
- monsterId: integer (foreign key)
- weaponId: integer (foreign key)
- reasoning: text
- preferences: json

## Endpoints

### Root Endpoint

**GET** `/`

Returns welcome message for the API.

**Response (200 - OK)**

```
"Monster Hunter Recommendation API with Gemini AI"
```

---

### Authentication Endpoints

#### 1. Login

**POST** `/login`

Authenticate user with email and password.

**Request Body:**

```json
{
  "email": "hunter@example.com",
  "password": "password123"
}
```

**Response (200 - OK)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "hunter@example.com",
    "name": "Hunter Name"
  }
}
```

**Response (400 - Bad Request)**

```json
{
  "message": "Invalid email or password"
}
```

#### 2. Google Login

**POST** `/google-login`

Authenticate user with Google OAuth token.

**Request Body:**

```json
{
  "googleToken": "google_oauth_token_here"
}
```

**Response (200 - OK)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "hunter@gmail.com",
    "name": "Hunter Name"
  }
}
```

---

### Data Endpoints

#### 3. Get All Monsters

**GET** `/monsters`

Retrieve all available monsters.

**Response (200 - OK)**

```json
{
  "monsters": [
    {
      "id": 1,
      "name": "Rathalos",
      "element": "Fire",
      "weakness": "Dragon",
      "habitat": "Ancient Forest",
      "description": "The King of the Skies..."
    },
    {
      "id": 2,
      "name": "Diablos",
      "element": "None",
      "weakness": "Ice",
      "habitat": "Wildspire Waste",
      "description": "A formidable flying wyvern..."
    }
  ]
}
```

#### 4. Get All Weapons

**GET** `/weapons`

Retrieve all available weapons.

**Response (200 - OK)**

```json
{
  "weapons": [
    {
      "id": 1,
      "name": "Chrome Razor I",
      "type": "Great Sword",
      "element": "None",
      "damage": 384,
      "description": "A massive sword with high raw damage"
    },
    {
      "id": 2,
      "name": "Rathalos Glinsword",
      "type": "Long Sword",
      "element": "Fire",
      "damage": 297,
      "description": "A fire-elemental long sword"
    }
  ]
}
```

---

### Recommendation Endpoints

#### 5. Get User Recommendations

**GET** `/recommendations`

_Requires Authentication_

Retrieve all recommendations for the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 - OK)**

```json
{
  "recommendations": [
    {
      "id": 1,
      "userId": 1,
      "monsterId": 1,
      "weaponId": 2,
      "reasoning": "Fire element is effective against this monster...",
      "preferences": {
        "playstyle": "aggressive",
        "experience": "intermediate"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "Monster": {
        "id": 1,
        "name": "Rathalos"
      },
      "Weapon": {
        "id": 2,
        "name": "Rathalos Glinsword",
        "type": "Long Sword"
      }
    }
  ]
}
```

#### 6. Generate Weapon Recommendation

**POST** `/recommendations/generate`

_Requires Authentication_

Generate AI-powered weapon recommendation based on user preferences and target monster.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "monsterId": 1,
  "preferences": {
    "playstyle": "aggressive",
    "experience": "intermediate",
    "preferredWeaponTypes": ["Great Sword", "Long Sword"],
    "preferredElements": ["Fire", "Thunder"]
  }
}
```

**Response (201 - Created)**

```json
{
  "id": 1,
  "userId": 1,
  "monsterId": 1,
  "weaponId": 2,
  "reasoning": "Based on your aggressive playstyle and intermediate experience, the Rathalos Glinsword is recommended. Its fire element exploits the monster's weakness, and the long sword's mobility suits your aggressive approach.",
  "preferences": {
    "playstyle": "aggressive",
    "experience": "intermediate",
    "preferredWeaponTypes": ["Great Sword", "Long Sword"],
    "preferredElements": ["Fire", "Thunder"]
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "Monster": {
    "id": 1,
    "name": "Rathalos",
    "element": "Fire",
    "weakness": "Dragon"
  },
  "Weapon": {
    "id": 2,
    "name": "Rathalos Glinsword",
    "type": "Long Sword",
    "element": "Fire",
    "damage": 297
  }
}
```

**Response (400 - Bad Request)**

```json
{
  "message": "Monster ID is required"
}
```

#### 7. Delete Recommendation

**DELETE** `/recommendations/:id`

_Requires Authentication_

Delete a specific recommendation.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 - OK)**

```json
{
  "message": "Recommendation deleted successfully"
}
```

**Response (404 - Not Found)**

```json
{
  "message": "Recommendation not found"
}
```

---

### AI Analysis Endpoints

#### 8. Analyze Monster

**GET** `/monsters/:monsterId/analyze`

Get AI-generated strategic analysis for a specific monster using Gemini AI.

**Response (200 - OK)**

```json
{
  "strengths": [
    "High aerial mobility",
    "Fire breath attacks",
    "Territorial aggression"
  ],
  "weaknesses": [
    "Vulnerable when grounded",
    "Weak to dragon element",
    "Predictable flight patterns"
  ],
  "recommendedElements": ["Dragon", "Water", "Thunder"],
  "huntingStrategy": "Focus on grounding the Rathalos by targeting its wings. Use dragon element weapons for maximum effectiveness. Stay mobile to avoid fire attacks and position yourself near the tail for safe attacking opportunities.",
  "difficulty": "7"
}
```

**Response (404 - Not Found)**

```json
{
  "message": "Monster not found"
}
```

#### 9. Get Best Weapon for Monster

**GET** `/monsters/:monsterId/best-weapon`

_Requires Authentication_

Get the best weapon recommendation for a specific monster using AI analysis.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 - OK)**

```json
{
  "weaponId": 15,
  "reasoning": "The Dragon Piercer bow is ideal for Rathalos due to its dragon element effectiveness and ranged capabilities. This allows you to maintain distance while exploiting the monster's elemental weakness.",
  "Monster": {
    "id": 1,
    "name": "Rathalos",
    "element": "Fire",
    "weakness": "Dragon"
  },
  "Weapon": {
    "id": 15,
    "name": "Dragon Piercer",
    "type": "Bow",
    "element": "Dragon",
    "damage": 240
  }
}
```

---

## Error Responses

### 400 - Bad Request

```json
{
  "message": "Validation error message"
}
```

### 401 - Unauthorized

```json
{
  "message": "Authentication required"
}
```

### 403 - Forbidden

```json
{
  "message": "Access denied"
}
```

### 404 - Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 - Internal Server Error

```json
{
  "message": "Internal server error"
}
```

## Gemini AI Integration

This API integrates with Google's Gemini AI for:

- **Weapon Recommendations**: AI analyzes user preferences, monster data, and available weapons to suggest optimal choices
- **Monster Analysis**: AI provides strategic hunting advice including strengths, weaknesses, and hunting strategies
- **Best Weapon Matching**: AI determines the most effective weapon for specific monsters

### AI Response Format

The AI responses are structured JSON objects that provide:

- Detailed reasoning for recommendations
- Strategic analysis based on monster characteristics
- Consideration of user preferences and experience level
- Element effectiveness and damage optimization

## Rate Limiting

The API may implement rate limiting for AI-powered endpoints to manage resource usage and costs.

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for all endpoints to support web client applications.
