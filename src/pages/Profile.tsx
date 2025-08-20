import { useAuth } from '../hooks/useAuth'

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const name = profile?.name ?? 'Utvecklingsläge'
  const email = user?.email ?? 'dev@test.se'
  const role = profile?.role ?? 'admin'
  return (
    <div className="rounded-lg border bg-white p-4 max-w-lg">
      <h2 className="font-semibold mb-3">Profil</h2>
      <div className="text-sm text-gray-700 space-y-1">
        <div><span className="text-gray-500">Namn:</span> {name}</div>
        <div><span className="text-gray-500">Email:</span> {email}</div>
        <div><span className="text-gray-500">Roll:</span> {role}</div>
      </div>
      <div className="mt-4">
        <button onClick={signOut} className="px-3 py-2 rounded bg-primary text-white text-sm hover:bg-primary/90 transition-colors">Logga ut</button>
      </div>
    </div>
  )
}


