import { requireUser } from "@/lib/authorize";
import IncomesPage from "@/features/incomes/pages/IncomesPage";
import {
   getCategoryOptions,
   searchMyFamilyMembersAction,
   searchMyIncomeRulesAction,
   searchMyIncomesAction,
} from "./actions";

export default async function Incomes() {
   // Verificamos si el usuario está autenticado.
   const user = await requireUser();

   // Obtenemos los datos iniciales de la página.
   const [initialIncomes, initialRules, familyMembersOptions, categoriesOptions] = await Promise.all([
      searchMyIncomesAction({ page: 1, size: 10 }),
      searchMyIncomeRulesAction({ page: 1, size: 10 }),
      searchMyFamilyMembersAction(user.familyId!),
      getCategoryOptions(),
   ]);

   return (
      <IncomesPage
         initialIncomes={initialIncomes}
         initialRules={initialRules}
         familyMembersOptions={familyMembersOptions}
         categoriesOptions={categoriesOptions}
      />
   );
}
