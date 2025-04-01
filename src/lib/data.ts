
import { Subscription } from "../types/subscription";
import { addMonths, addYears, addWeeks, addDays } from "date-fns";

// Function to calculate next billing date based on cycle
export const calculateNextBillingDate = (
  currentDate: Date,
  billingCycle: "monthly" | "yearly" | "quarterly" | "weekly"
): Date => {
  switch (billingCycle) {
    case "weekly":
      return addWeeks(currentDate, 1);
    case "monthly":
      return addMonths(currentDate, 1);
    case "quarterly":
      return addMonths(currentDate, 3);
    case "yearly":
      return addYears(currentDate, 1);
    default:
      return addMonths(currentDate, 1);
  }
};

// Mock subscription data
export const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    description: "Standard Plan",
    logo: "netflix",
    color: "subscription-netflix",
    cost: 15.99,
    billingCycle: "monthly",
    nextBillingDate: addDays(new Date(), 7),
    status: "active",
    category: "Entertainment",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Spotify",
    description: "Premium",
    logo: "spotify",
    color: "subscription-spotify",
    cost: 9.99,
    billingCycle: "monthly",
    nextBillingDate: addDays(new Date(), 14),
    status: "active",
    category: "Music",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Amazon Prime",
    description: "Annual Membership",
    logo: "prime",
    color: "subscription-prime",
    cost: 119.0,
    billingCycle: "yearly",
    nextBillingDate: addMonths(new Date(), 8),
    status: "active",
    category: "Shopping",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Disney+",
    description: "Basic Plan",
    logo: "disney",
    color: "subscription-disney",
    cost: 7.99,
    billingCycle: "monthly",
    nextBillingDate: addDays(new Date(), 3),
    status: "active",
    category: "Entertainment",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "YouTube Premium",
    description: "Ad-free experience",
    logo: "youtube",
    color: "subscription-youtube",
    cost: 11.99,
    billingCycle: "monthly",
    nextBillingDate: addDays(new Date(), 21),
    status: "active",
    category: "Entertainment",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "HBO Max",
    description: "Premium Plan",
    logo: "hbo",
    color: "subscription-hbo",
    cost: 14.99,
    billingCycle: "monthly",
    nextBillingDate: addDays(new Date(), -5),
    status: "expired",
    category: "Entertainment",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    name: "Apple Music",
    description: "Individual Plan",
    logo: "apple",
    color: "subscription-apple",
    cost: 9.99,
    billingCycle: "monthly",
    nextBillingDate: new Date(),
    status: "pending",
    category: "Music",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    name: "Hulu",
    description: "Ad-supported",
    logo: "hulu",
    color: "subscription-hulu",
    cost: 7.99,
    billingCycle: "monthly",
    nextBillingDate: addDays(new Date(), -30),
    status: "cancelled",
    category: "Entertainment",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Function to get monthly cost of subscriptions
export const getTotalMonthlyCost = (subscriptions: Subscription[]): number => {
  return subscriptions
    .filter((sub) => sub.status === "active")
    .reduce((total, sub) => {
      if (sub.billingCycle === "yearly") {
        return total + sub.cost / 12;
      } else if (sub.billingCycle === "quarterly") {
        return total + sub.cost / 3;
      } else if (sub.billingCycle === "weekly") {
        return total + sub.cost * 4.33; // Average weeks in a month
      }
      return total + sub.cost;
    }, 0);
};

// Function to get yearly cost of subscriptions
export const getTotalYearlyCost = (subscriptions: Subscription[]): number => {
  return subscriptions
    .filter((sub) => sub.status === "active")
    .reduce((total, sub) => {
      if (sub.billingCycle === "monthly") {
        return total + sub.cost * 12;
      } else if (sub.billingCycle === "quarterly") {
        return total + sub.cost * 4;
      } else if (sub.billingCycle === "weekly") {
        return total + sub.cost * 52;
      }
      return total + sub.cost;
    }, 0);
};
