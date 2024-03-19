export type User = {
    id: string;
    avatar_url: string | null;
    full_name: string | null;
    phone_number: string | null
    updated_at: string | null;
    username: string;
    website: string | null;
  }


  export type Expense = {
    id: string | null
    amount: number 
    date: string
    description: string
    payer_id: User | null
  }

  export type ExpenseMember = {
    id: string
    member_id: User 
    isOwed: number 
    owes: number 
  }