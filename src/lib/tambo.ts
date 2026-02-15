import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import { PaymentCard, paymentCardSchema } from "@/components/PaymentCard";
import { BalanceCard, balanceCardSchema } from "@/components/BalanceCard";
import { GroupCard, groupCardSchema } from "@/components/GroupCard";
import { SplitCard, splitCardSchema } from "@/components/SplitCard";
import {
  getBalance,
  createGroup,
  addMember,
  addMemberByEmail,
  createSplit,
  buildBatchPayment,
  listGroups,
} from "./aria-tools";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

export const tools: TamboTool[] = [
  {
    name: "getBalance",
    description: "Get αUSD balance for a wallet. Render BalanceCard after.",
    tool: getBalance,
    inputSchema: z.object({
      address: z.string().describe("Wallet address"),
    }),
    outputSchema: z.object({
      address: z.string(),
      balance: z.string(),
      token: z.string(),
    }),
  },
  {
    name: "createGroup",
    description: "Create a payment group. Render GroupCard after.",
    tool: createGroup,
    inputSchema: z.object({
      name: z.string().describe("Group name"),
      creatorAddress: z.string().describe("Creator's wallet"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      group: z.any(),
      message: z.string(),
    }),
  },
  {
    name: "addMember",
    description: "Add member by wallet address. Render GroupCard after.",
    tool: addMember,
    inputSchema: z.object({
      groupId: z.string(),
      memberAddress: z.string(),
      email: z.string().optional(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      group: z.any().optional(),
      message: z.string().optional(),
      error: z.string().optional(),
    }),
  },
  {
    name: "addMemberByEmail",
    description: "Add member by email. Creates wallet for them. Render GroupCard after.",
    tool: addMemberByEmail,
    inputSchema: z.object({
      groupId: z.string(),
      email: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      group: z.any().optional(),
      email: z.string().optional(),
      walletAddress: z.string().optional(),
      message: z.string().optional(),
      error: z.string().optional(),
    }),
  },
  {
    name: "createSplit",
    description: "Send money equally to all group members. Render SplitCard after.",
    tool: createSplit,
    inputSchema: z.object({
      groupId: z.string(),
      amount: z.string().describe("Total amount to send"),
      description: z.string().describe("What it's for"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      split: z.any().optional(),
      message: z.string().optional(),
      error: z.string().optional(),
    }),
  },
  {
    name: "buildBatchPayment",
    description: "Build transactions for a split. Render PaymentCard after.",
    tool: buildBatchPayment,
    inputSchema: z.object({
      splitId: z.string(),
      payerAddress: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      splitId: z.string().optional(),
      calls: z.array(z.any()).optional(),
      summary: z.any().optional(),
      error: z.string().optional(),
    }),
  },
  {
    name: "listGroups",
    description: "List user's groups",
    tool: listGroups,
    inputSchema: z.object({
      userAddress: z.string(),
    }),
    outputSchema: z.object({
      groups: z.array(z.any()),
      count: z.number(),
    }),
  },
];

export const components: TamboComponent[] = [
  {
    name: "Graph",
    description: "Chart for data visualization",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description: "Clickable option cards",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "PaymentCard",
    description: "Payment confirmation with Pay button. Props: splitId, totalAmount, recipientCount, memo, calls",
    component: PaymentCard,
    propsSchema: paymentCardSchema,
  },
  {
    name: "BalanceCard",
    description: "Wallet balance display. Props: address, balance, token",
    component: BalanceCard,
    propsSchema: balanceCardSchema,
  },
  {
    name: "GroupCard",
    description: "Group with members. Props: id, name, members, createdBy",
    component: GroupCard,
    propsSchema: groupCardSchema,
  },
  {
    name: "SplitCard",
    description: "Payment split details. Props: id, groupName, amount, description, perPerson, memberCount, status",
    component: SplitCard,
    propsSchema: splitCardSchema,
  },
];