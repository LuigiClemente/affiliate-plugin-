# Medusa Commerce Application - Discount Entity Documentation

## Introduction

The Discount entity in the Medusa commerce application represents a discount offered to customers. This document provides detailed information about the Discount entity, including its attributes, relationships, and customization options.

## Entity Overview

The Discount entity is responsible for managing various aspects of discounts, such as code, eligibility, and associated rules. We have made some modifications to accommodate additional functionality related to commission types.

## Attributes

* `code` (string): A unique identifier for the discount.
* `is_dynamic` (boolean): Indicates if the discount is dynamic, allowing it to change over time.
* `rule_id` (string): ID of the associated DiscountRule.
* `is_disabled` (boolean): Indicates if the discount is currently disabled.
* `parent_discount_id` (string): ID of the parent discount if applicable.
* `starts_at` (Date): The date when the discount becomes effective.
* `ends_at` (Date | null): The date when the discount expires (nullable for ongoing discounts).
* `valid_duration` (string | null): Duration of validity (nullable for open-ended discounts).
* `usage_limit` (number | null): Maximum number of times the discount can be used (nullable for unlimited use).
* `usage_count` (number): Current count of how many times the discount has been used.
* `user` (User): Reference to the related User entity for user-specific discounts.
* `commission_percentage` (number | null): Percentage of the sale amount earned as commission (nullable).
* `fixed_commission_amount` (number): Fixed amount commission (default: 0).

## Relationships

* `rule` (DiscountRule): Reference to the related DiscountRule entity.
* `parent_discount` (Discount): Reference to the parent discount entity if applicable.
* `commissions` (Commission[]): Commission records associated with this discount.
* `orders` (Order[]): Orders associated with earned Commissions.

## BeforeInsert Method

The BeforeInsert method ensures that discount codes are consistently formatted for storage and retrieval. It converts the discount code to uppercase and trims whitespace.

## Commission Configuration

To accommodate commission-related changes, we have introduced two commission configuration attributes:

* `commission_percentage` (number | null): Percentage of the sale amount earned as commission (nullable).
* `fixed_commission_amount` (number): Fixed amount commission (default: 0).

The `validateCommissionConfig` method ensures that only one commission configuration is set, either `commission_percentage` or `fixed_commission_amount`.

## Additional Functionality

You can enhance the Discount entity by adding utility methods for total calculations related to commission types, cascading deletes for DiscountRule-related Commissions, or any other custom functionality as needed.

## Migration

To add the fixed commission columns and reflect the changes in the database, you may need to create a migration script. Below is an example of a migration script that adds these columns:

```javascript
// src/migrations/20230306000301-add-commission-columns-to-discount.js

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommissionColumnsToDiscount20230306000301 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    // Add fixed_commission_amount column
    await queryRunner.query(`
      ALTER TABLE "discount" 
      ADD COLUMN "fixed_commission_amount" numeric(10,2) DEFAULT 0 NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    // Drop fixed_commission_amount column
    await queryRunner.query(`
      ALTER TABLE "discount"
      DROP COLUMN "fixed_commission_amount"
    `);
  }
}
```

## TypeScript Declaration File

A TypeScript declaration file is used to make TypeScript aware of the custom attributes. Here's an example declaration file:

```typescript
// src/index.d.ts

declare module "@medusajs/medusa" {
  interface Discount {
    user: User;
    commission_percentage: number;
    fixed_commission_amount: number;
  }
}
```

## Model Extension

To create an extended Discount entity with the changes, you can create a model file as follows:

```typescript
// src/models/discount.ts

import { Entity } from "typeorm";
import { Discount as BaseDiscount } from "@medusajs/medusa";

@Entity()
export class Discount extends BaseDiscount {
  // Custom attributes and relations can be added here.
}
```

## Loader File

A loader file allows custom attributes to be returned from API routes. Here's an example loader file:

```javascript
// src/loaders/discount-fields.ts

export default async function () {
  const imports = await import("@medusajs/medusa/dist/api/routes/store/discounts");
  imports.allowedDiscountFields = [
    ...imports.allowedDiscountFields,
    "user",
    "commission_percentage",
    "fixed_commission_amount"
  ];
}
```

## Building

You can compile the TypeScript files by adding a build script to your project:

```json
{
  "scripts": {
    "build": "tsc"
  }
}
```

This documentation covers the Discount entity in the Medusa commerce application, along with the changes related to commission types and customization options for specific needs.
