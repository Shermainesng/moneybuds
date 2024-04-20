export type User = {
    id: string;
    avatar_url: string | null;
    full_name: string | null;
    phone_number: string
    updated_at: string | null;
    username: string;
    website: string | null;
  }

  export type Group = {
    id: string
    name: string
    // created_by: User | null
  }

  export type Expense = {
    id: string | null
    amount: number 
    // date: string | null
    description: string
    payer_id: User
    created_at: string | null
  }

  export type ExpenseMember = {
    id: string
    member_id: User 
    expense_id: Expense
    isOwed: number 
    owes: number 
  }


export type FriendExpense = {
  id: string
  amt: string
}
