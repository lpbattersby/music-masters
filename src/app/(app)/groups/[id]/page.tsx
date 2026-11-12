import { getCurrentUserGroup } from '@/app/lib/auth/dal'
import GroupInfo from './group-info'

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
    const { id } = await params
    const group = await getCurrentUserGroup(Number(id))

  return (
    <main className='flex min-w-full flex-col items-start justify-center gap-4 bg-white p-2 pb-10 m-5 rounded-4xl'>
      <h1 className="text-2xl">{group.name}</h1>
      <GroupInfo group={group} />
    </main>
  )
}