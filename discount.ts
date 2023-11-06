import { Entity, Column, Index, ManyToOne, JoinColumn, BeforeInsert, OneToMany } from "typeorm";
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity";
import { DiscountRule } from "./discount-rule";
import { DiscountCondition } from "./discount-condition";
import { User } from "./user";
import { Commission } from "./commission";
import { Order } from "./order";

@Entity()
export class Discount extends SoftDeletableEntity {
  // Discount Code: A unique identifier for the discount.
  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  code: string;

  // Dynamic Discount: Indicates if the discount is dynamic.
  @Column()
  is_dynamic: boolean;

  // Related DiscountRule: ID of the associated DiscountRule.
  @Index()
  @Column({ nullable: true })
  rule_id: string;

  // Rule Entity: Reference to the related DiscountRule entity.
  @ManyToOne(() => DiscountRule, { cascade: true })
  @JoinColumn({ name: "rule_id" })
  rule: DiscountRule;

  // Disabled Status: Indicates if the discount is currently disabled.
  @Column()
  is_disabled: boolean;

  // Parent Discount: ID of the parent discount if applicable.
  @Column({ nullable: true })
  parent_discount_id: string;

  // Parent Discount Entity: Reference to the parent discount entity.
  @ManyToOne(() => Discount, { nullable: true })
  @JoinColumn({ name: "parent_discount_id" })
  parent_discount: Discount;

  // Start Date: The date when the discount becomes effective.
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  starts_at: Date;

  // End Date: The date when the discount expires (nullable for ongoing discounts).
  @Column({ type: "timestamptz", nullable: true })
  ends_at: Date | null;

  // Validity Duration: Duration of validity (nullable for open-ended discounts).
  @Column({ nullable: true })
  valid_duration: string | null;

  // Usage Limit: Maximum number of times the discount can be used (nullable for unlimited use).
  @Column({ nullable: true })
  usage_limit: number | null;

  // Usage Count: Current count of how many times the discount has been used.
  @Column({ default: 0 })
  usage_count: number;

  // User Link: Reference to the related User entity for user-specific discounts.
  @ManyToOne(() => User, { cascade: true, nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  // Commission Percentage: Percentage of sale amount earned as commission (nullable).
  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  commission_percentage: number;

  // Related Commissions: Commission records associated with this discount.
  @OneToMany(() => Commission, (commission) => commission.discount)
  commissions: Commission[];

  // Related Orders: Orders associated with earned Commissions.
  @OneToMany(() => Order, (order) => order.commission)
  orders: Order[];

  /**
   * BeforeInsert Method: Converts the discount code to uppercase and trims whitespace.
   * This method ensures that discount codes are consistently formatted for storage and retrieval.
   */
  @BeforeInsert()
  private upperCaseCodeAndTrim(): void {
    this.code = this.code.toUpperCase().trim();
  }

  /**
   * Validate commission_percentage.
   * Ensure that commission_percentage is within a valid range (0 to 100 if it represents a percentage).
   */
  private validateCommissionPercentage(): boolean {
    if (this.commission_percentage !== null) {
      return this.commission_percentage >= 0 && this.commission_percentage <= 100;
    }
    return true; // Null is allowed
  }

  // Additional Functionality:
  // You can potentially add cascading deletes for DiscountRule-related Commissions.
  // Utility methods for commission total calculations on User and DiscountRule can be implemented.
}
