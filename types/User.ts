export interface User {
   id?: string;
   username: string;
   email: string;
   familyId?: string;
   familyMemberId?: string;
   isAdmin: boolean;
   isOwnerUser: boolean;
   enable: boolean;
}

export const emptyUser: User = {
   id: undefined,
   username: "",
   email: "",  
   familyId: undefined,
   familyMemberId: undefined,
   isAdmin: false,
   isOwnerUser: false,
   enable: false,
}