## Extending the Medusa JS Admin UI to Add a Discount Extension Menu

This guide will illustrate the logic of extending the Medusa JS Admin UI to add a discount extension menu. The extension menu will allow users to create discounts that are applied to a specific user.

**Prerequisites:**

-   Node.js v16 or higher
-   Yarn v1.22 or higher
-   Medusa JS v0.13 or higher

**Steps:**

1.  Create a new directory for your extension and navigate to it.
2.  Initialize a new Node.js project.
3.  Install the Medusa JS admin extension dependencies.

4.  Create a new file called `src/admin/index.js` and add the following code:

```
import { AdminExtension } from '@medusajs/admin';

class DiscountExtension extends AdminExtension {
  constructor() {
    super();

    // Add a new menu item to the Discounts page.
    this.addMenuItem('Discounts', {
      label: 'Discount Extensions',
      icon: 'Gift',
      route: '/discounts/extensions',
    });

    // Register a new route for the discount extension menu.
    this.addRoute('/discounts/extensions', {
      component: () => import('./DiscountExtensionMenu'),
    });
  }
}

export default DiscountExtension;
```

5.  Create a new file called `src/admin/DiscountExtensionMenu.js` and add the following code:

```
import React from 'react';
import { Form, Input, Radio, Button } from '@medusajs/admin';

class DiscountExtensionMenu extends React.Component {
  state = {
    type: 'percentage',
    amount: '',
    user: null,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = async () => {
    // Create a new discount object.
    const discount = {
      type: this.state.type,
      amount: this.state.amount,
      users: [this.state.user],
    };

    // Create the discount using the Medusa JS Admin API.
    const response = await fetch('/admin/discounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discount),
    });

    // Check the response status code.
    if (response.status === 201) {
      // The discount was created successfully.
      // Redirect the user to the discounts page.
      window.location.href = '/admin/discounts';
    } else {
      // An error occurred while creating the discount.
      // Display an error message to the user.
    }
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Radio
          name="type"
          value="percentage"
          checked={this.state.type === 'percentage'}
          onChange={this.handleChange}
        >
          Percentage
        </Radio>
        <Radio
          name="type"
          value="fixed_amount"
          checked={this.state.type === 'fixed_amount'}
          onChange={this.handleChange}
        >
          Fixed Amount
        </Radio>
        <Input
          name="amount"
          type={this.state.type === 'percentage' ? 'number' : 'text'}
          placeholder="Amount"
          value={this.state.amount}
          onChange={this.handleChange}
        />
        <Input
          name="user"
          type="text"
          placeholder="User"
          value={this.state.user}
          onChange={this.handleChange}
        />
        <Button type="submit">Create Discount</Button>
      </Form>
    );
  }
}

export default DiscountExtensionMenu;
```

6.  Build your extension.

7.  Update your Medusa JS configuration file to enable your extension.

```
module.exports = {
  plugins: [
    {
      resolve: '@medusajs/extension-discount',
    },
  ],
};
```

8.  Restart the Medusa JS server.
