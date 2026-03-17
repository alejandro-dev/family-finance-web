export interface FamilyMember {
   id: string;
   name: string;
   birthDate: string;
   email?: string;
   userId?: string;
   familyId?: string;
   isEnabled: boolean;
   isOwner: boolean;
}