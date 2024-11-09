export const revalidate = 0;
// https://tailwindcomponents.com/component/hoverable-table
import { Pagination, Title } from '@/components';

import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';
import { getPaginatedUsers } from '@/actions';

interface Props {
    searchParams: {
        page?: string;
    };
}

export default async function AdminUsersPage({ searchParams }: Props) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    const { ok, users = [], totalPages } = await getPaginatedUsers({ page });

    if (!ok) redirect('/auth/login');

    return (
        <div>
            <Title title="Mantenimiento de Usuarios" />

            <div className="mb-10">
                <UsersTable users={users} />

                <Pagination totalPages={totalPages ?? 0} />
            </div>
        </div>
    );
}