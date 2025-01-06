# Substack Subscriber

This is an unofficial Node.js package that helps you subscribe users to your Substack newsletters. 

## Disclaimer
This is not an official Substack API and I am not affiliated with Substack in any way. Use this package at your own risk.

## Installation

You can install the package via npm:

```bash
npm install substack-subscriber
```

## Usage

### Example Code:

```javascript
const { subscribe } = require('substack-subscriber');

const email = 'user@example.com';
const substackUrl = 'https://your-substack-url';

subscribe(email, substackUrl)
  .then(response => {
    console.log('Subscribed successfully:', response);
  })
  .catch(error => {
    console.error('Error subscribing:', error);
  });
```

### Parameters:

- `email`: The email address of the user you want to subscribe.
- `substackUrl`: The URL of the Substack newsletter to subscribe to.

### Example Response:

When the subscription is successful, you'll receive a response similar to this:

```json
{
  "email": "user@example.com",
  "prompt_to_login": false,
  "requires_confirmation": true,
  "subscription_id": 674300000,
  "didSignup": false,
  "hasAppInstalled": false
}
```

- `email`: The email address that was used for subscription.
- `prompt_to_login`: A boolean indicating whether the user needs to log in.
- `requires_confirmation`: A boolean indicating whether the user needs to confirm their subscription.
- `subscription_id`: The ID associated with the subscription.
- `didSignup`: A boolean indicating whether the user has completed the sign-up process.
- `hasAppInstalled`: A boolean indicating whether the user has the Substack app installed.

> **Note:** If the value of `requires_confirmation` is `true`, the subscriber will need to click the confirmation link in their email before they are added to the newsletter.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
