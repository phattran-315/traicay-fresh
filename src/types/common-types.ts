import { APP_URL } from "@/constants/navigation.constant";
import { Customer, CustomerPhoneNumber } from "@/payload/payload-types";

export interface IUser {
    user:Customer|CustomerPhoneNumber|undefined|null
}
export interface ISheetDialogState{
    isOpen:boolean,
    onToggleOpenState:()=>void
}
export type APP_URL_KEY=keyof typeof APP_URL