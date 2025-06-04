# Redux Login Implementation

## Overview

Redux has been implemented specifically for the login feature only. This provides better state management for login functionality while keeping the rest of the application unchanged.

## Files Modified

### 1. Store Configuration

- **`src/store/authSlice.js`** - Contains login-specific Redux logic
- **`src/store/store.js`** - Redux store configuration
- **`src/main.jsx`** - Added Redux Provider

### 2. Login Page

- **`src/pages/Login.page.jsx`** - Updated to use Redux for login functionality

## Redux State Structure

The login state contains:

```javascript
{
  login: {
    isLoading: false,    // Shows loading state during login
    error: null,         // Contains error message if login fails
    success: false       // Indicates successful login
  }
}
```

## Available Actions

### `loginUser({ email, password })`

- Async action that handles the login API call
- Automatically stores token in localStorage on success
- Returns error message on failure

### `clearLoginError()`

- Clears any error messages from the state

### `clearLoginSuccess()`

- Clears the success flag

### `resetLoginState()`

- Resets the entire login state to initial values

## How It Works

1. **User submits login form**
2. **Redux dispatches `loginUser` action**
3. **Loading state is set to true**
4. **API call is made to login endpoint**
5. **On success:**
   - Token is stored in localStorage
   - Success state is set to true
   - Success message is shown
   - User is redirected to home page
6. **On error:**
   - Error message is stored in state
   - Error popup is shown

## Key Features

- ✅ **Loading State**: Button shows "Logging in..." during API call
- ✅ **Error Handling**: Shows specific error messages from API
- ✅ **Success Feedback**: Shows success message on successful login
- ✅ **Form Validation**: Validates that email and password are provided
- ✅ **Automatic Redirect**: Navigates to home page after successful login
- ✅ **Token Storage**: Automatically stores JWT token in localStorage

## Usage in Login Component

```jsx
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearLoginError } from "../store/authSlice";

// Get login state
const { isLoading, error, success } = useSelector((state) => state.login);

// Dispatch login action
const dispatch = useDispatch();
dispatch(loginUser({ email, password }));
```

## Benefits of This Implementation

1. **Centralized Login Logic**: All login-related logic is in one place
2. **Better Error Handling**: Consistent error handling across the application
3. **Loading States**: Visual feedback during login process
4. **Predictable State Updates**: Redux pattern ensures predictable state changes
5. **Easy Testing**: Login logic can be easily unit tested
6. **Developer Tools**: Redux DevTools can be used for debugging

## Testing the Implementation

1. Start the development server: `npm run dev`
2. Navigate to `/login`
3. Try logging in with valid credentials
4. Try logging in with invalid credentials
5. Observe the loading states and error messages

The application is now running at: http://localhost:5173/
