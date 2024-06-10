import type { AccessArgs } from 'payload/config'

import type { Customer } from '../payload-types'

type isAdmin = (args: AccessArgs<unknown, Customer>) => boolean

export const isAdmins: isAdmin = ({ req: { user } }) => {
    // only admins collection have role
    if(!user?.role) return false
    return true
}
