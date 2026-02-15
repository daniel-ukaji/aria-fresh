import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import { PaymentCard, paymentCardSchema } from "@/components/PaymentCard";
import { BalanceCard, balanceCardSchema } from "@/components/BalanceCard";
import { GroupCard, groupCardSchema } from "@/components/GroupCard";
import { SplitCard, splitCardSchema } from "@/components/SplitCard";
import {
  getBalance,
  createGroup,
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
    description: "Check wallet balance. Returns address, balance, token. Render BalanceCard with these props.",
    tool: getBalance,
    inputSchema: z.object({
      address: z.string(),
    }),
    outputSchema: z.object({
      address: z.string(),
      balance: z.string(),
      token: z.string(),
    }),
  },
  {
    name: "createGroup",
    description: "Create a payment group. Returns id, name, members, createdBy. Render GroupCard with these props.",
    tool: createGroup,
    inputSchema: z.object({
      name: z.string(),
      creatorAddress: z.string(),
    }),
    outputSchema: z.object({
      id: z.string(),
      name: z.string(),
      members: z.array(z.object({
        address: z.string(),
        email: z.string().optional(),
      })),
      createdBy: z.string(),
    }),
  },
  {
    name: "addMemberByEmail",
    description: "Add member by email. Creates wallet if new. Returns group data plus addedEmail, addedWallet, walletCreated. Render GroupCard. If walletCreated is true, mention 'wallet created for [email]'.",
    tool: addMemberByEmail,
    inputSchema: z.object({
      groupId: z.string(),
      email: z.string(),
    }),
    outputSchema: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      members: z.array(z.object({
        address: z.string(),
        email: z.string().optional(),
      })).optional(),
      createdBy: z.string().optional(),
      addedEmail: z.string().optional(),
      addedWallet: z.string().optional(),
      walletCreated: z.boolean().optional(),
      error: z.string().optional(),
    }),
  },
  {
    name: "createSplit",
    description: "Split amount equally among group members. Returns id, groupName, amount, description, perPerson, memberCount, status. Render SplitCard with these exact props.",
    tool: createSplit,
    inputSchema: z.object({
      groupId: z.string(),
      amount: z.string(),
      description: z.string(),
    }),
    outputSchema: z.object({
      id: z.string().optional(),
      groupName: z.string().optional(),
      amount: z.string().optional(),
      description: z.string().optional(),
      perPerson: z.string().optional(),
      memberCount: z.number().optional(),
      status: z.string().optional(),
      error: z.string().optional(),
    }),
  },
  {
    name: "buildBatchPayment",
    description: "Prepare payment transactions. Returns splitId, totalAmount, recipientCount, memo, calls. Render PaymentCard with these props.",
    tool: buildBatchPayment,
    inputSchema: z.object({
      splitId: z.string(),
      payerAddress: z.string(),
    }),
    outputSchema: z.object({
      splitId: z.string().optional(),
      totalAmount: z.string().optional(),
      recipientCount: z.number().optional(),
      memo: z.string().optional(),
      calls: z.array(z.any()).optional(),
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
    description: "Chart visualization",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description: "Clickable cards",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "BalanceCard",
    description: "Shows wallet balance. Required props: address, balance, token",
    component: BalanceCard,
    propsSchema: balanceCardSchema,
  },
  {
    name: "GroupCard",
    description: "Shows group with members. Required props: id, name, members, createdBy",
    component: GroupCard,
    propsSchema: groupCardSchema,
  },
  {
    name: "SplitCard",
    description: "Shows payment split. Required props: id, groupName, amount, description, perPerson, memberCount, status",
    component: SplitCard,
    propsSchema: splitCardSchema,
  },
  {
    name: "PaymentCard",
    description: "Payment confirmation with Pay button. Required props: splitId, totalAmount, recipientCount, memo, calls",
    component: PaymentCard,
    propsSchema: paymentCardSchema,
  },
];