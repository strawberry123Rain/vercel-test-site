import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Case, Task, DbUser, Property, Unit } from '../types'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const STATUS_OPTIONS: Case['status'][] = ['reported', 'in_progress', 'done', 'closed']

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<Case | null>(null)
  const [assigned, setAssigned] = useState<DbUser | null>(null)
  const [property, setProperty] = useState<Property | null>(null)
  const [unit, setUnit] = useState<Unit | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentsSupported, setCommentsSupported] = useState(true)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoading(true)
      if (USE_MOCK) {
        const mock: Case = {
          id,
          title: 'Mock ärende',
          description: 'Detta är ett mock-ärende för utveckling',
          property_id: 'prop-1',
          unit_id: 'unit-1',
          category: 'Värme',
          priority: 'normal',
          status: 'in_progress',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          assigned_to: 'dev-user',
          created_by: 'dev-user',
        }
        setItem(mock)
        setAssigned({ id: 'dev-user', role: 'förvaltare', name: 'Dev User', email: 'dev@test.se', created_at: new Date().toISOString() })
        setProperty({ id: 'prop-1', name: 'Newsec Demo Fastighet', address: 'Exempelgatan 1', created_at: new Date().toISOString() })
        setUnit({ id: 'unit-1', property_id: 'prop-1', type: 'lägenhet', unit_number: 'A12', size: 72, created_at: new Date().toISOString() })
        setTasks([])
        setComments([])
        setLoading(false)
        return
      }
      const { data: caseRow, error: caseErr } = await supabase.from('cases').select('*').eq('id', id).maybeSingle()
      if (caseErr || !caseRow) {
        setLoading(false)
        return
      }
      const c = caseRow as unknown as Case
      setItem(c)

      const [{ data: u }, { data: p }, { data: un }, { data: t }] = await Promise.all([
        c.assigned_to ? supabase.from('users').select('*').eq('id', c.assigned_to).maybeSingle() : Promise.resolve({ data: null }),
        c.property_id ? supabase.from('properties').select('*').eq('id', c.property_id).maybeSingle() : Promise.resolve({ data: null }),
        c.unit_id ? supabase.from('units').select('*').eq('id', c.unit_id).maybeSingle() : Promise.resolve({ data: null }),
        supabase.from('tasks').select('*').eq('case_id', id).order('created_at', { ascending: false }),
      ])
      setAssigned((u as any) ?? null)
      setProperty((p as any) ?? null)
      setUnit((un as any) ?? null)
      setTasks(((t as any) ?? []) as Task[])

      // Comments are optional; handle table absence
      const { data: com, error: comErr } = await supabase.from('case_comments' as any).select('*').eq('case_id', id).order('created_at', { ascending: false })
      if (comErr) {
        setCommentsSupported(false)
        setComments([])
      } else {
        setComments((com as any) ?? [])
      }

      setLoading(false)
    }

    load()

    if (USE_MOCK) return
    const channels = [
      supabase.channel('case-detail-cases').on('postgres_changes', { event: '*', schema: 'public', table: 'cases', filter: `id=eq.${id}` }, () => load()),
      supabase.channel('case-detail-tasks').on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `case_id=eq.${id}` }, () => load()),
      supabase.channel('case-detail-comments').on('postgres_changes', { event: '*', schema: 'public', table: 'case_comments', filter: `case_id=eq.${id}` }, () => load()),
    ]
    channels.forEach((ch) => ch.subscribe())
    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch))
    }
  }, [id])

  const onChangeStatus = async (status: Case['status']) => {
    if (!item || USE_MOCK) {
      setItem((prev: Case | null) => (prev ? { ...prev, status } : prev))
      return
    }
    setUpdating(true)
    const { error } = await supabase.from('cases').update({ status, updated_at: new Date().toISOString() }).eq('id', item.id)
    setUpdating(false)
    if (error) alert(error.message)
  }

  const addComment = async () => {
    if (!newComment.trim()) return
    if (USE_MOCK) {
      setComments((prev: any[]) => [{ id: String(prev.length + 1), case_id: id, author_id: 'dev-user', content: newComment, created_at: new Date().toISOString() }, ...prev])
      setNewComment('')
      return
    }
    const { data: session } = await supabase.auth.getUser()
    const authorId = session.user?.id ?? null
    const { error } = await supabase.from('case_comments' as any).insert({ case_id: id, author_id: authorId, content: newComment })
    if (error) {
      alert(error.message)
    } else {
      setNewComment('')
    }
  }

  const priorityColor = useMemo(() => ({
    akut: '#FF6000',
    hög: '#d97706',
    normal: '#4F6CF5',
    låg: '#6C757D',
  }) as Record<string, string>, [])

  if (loading) return <div className="p-4">Laddar…</div>
  if (!item) return <div className="p-4">Ärendet hittades inte. <button className="underline" onClick={() => navigate(-1)}>Tillbaka</button></div>

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: '#EAECEF' }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Ärende</div>
            <h1 className="text-xl md:text-2xl font-semibold" style={{ color: '#161C3B' }}>{item.title}</h1>
            <div className="mt-1 text-sm text-gray-600 max-w-3xl">{item.description}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded text-white" style={{ background: priorityColor[item.priority] }}>{item.priority}</span>
              <span className="px-2 py-1 rounded bg-gray-100">Kategori: {item.category}</span>
              {property && <span className="px-2 py-1 rounded bg-gray-100">Fastighet: {property.name}</span>}
              {unit && <span className="px-2 py-1 rounded bg-gray-100">Enhet: {unit.unit_number}</span>}
            </div>
          </div>
          <div className="w-full md:w-auto md:text-right">
            <label className="text-xs text-gray-500">Status</label>
            <div className="mt-1">
              <select className="border rounded px-3 py-2" value={item.status} onChange={(e) => onChangeStatus(e.target.value as Case['status'])} disabled={updating}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{labelStatus(s)}</option>)}
              </select>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <div>Ansvarig: {assigned?.name ?? '—'}</div>
              <div>Skapad: {new Date(item.created_at).toLocaleString()}</div>
              <div>Uppdaterad: {new Date(item.updated_at).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-2" style={{ borderColor: '#EAECEF' }}>
          <h2 className="font-semibold mb-3" style={{ color: '#161C3B' }}>Historik</h2>
          {tasks.length === 0 ? (
            <div className="text-sm text-gray-500">Ingen historik ännu.</div>
          ) : (
            <ul className="divide-y">
              {tasks.map((t) => (
                <li key={t.id} className="py-2 flex items-center justify-between">
                  <span className="text-sm text-gray-800">{t.description}</span>
                  <span className="text-xs text-gray-500">{t.completed_at ? 'Klar ' + new Date(t.completed_at).toLocaleString() : (t.due_date ? 'Förfaller ' + new Date(t.due_date).toLocaleDateString() : '')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: '#EAECEF' }}>
          <h2 className="font-semibold mb-3" style={{ color: '#161C3B' }}>Kommentarer</h2>
          {!commentsSupported && (
            <div className="text-sm text-gray-500">Kommentartabell saknas (case_comments). Skapa den för att aktivera kommentarer.</div>
          )}
          {commentsSupported && (
            <>
              <div className="space-y-3 max-h-72 overflow-auto pr-1">
                {comments.length === 0 ? (
                  <div className="text-sm text-gray-500">Inga kommentarer ännu.</div>
                ) : (
                  <>
                    {comments.map((c) => (
                      <div key={c.id} className="border rounded p-2" style={{ borderColor: '#F1F2F4' }}>
                        <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
                        <div className="text-sm text-gray-800">{c.content}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <input className="border rounded px-3 py-2 flex-1" placeholder="Skriv en kommentar" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <button className="px-3 py-2 rounded text-white" style={{ background: '#4F6CF5' }} onClick={addComment}>Skicka</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <Link to="/cases" className="text-sm underline">Tillbaka till ärenden</Link>
      </div>
    </div>
  )
}

function labelStatus(s: Case['status']) {
  if (s === 'reported') return 'Rapporterad'
  if (s === 'in_progress') return 'Pågår'
  if (s === 'done') return 'Klar'
  if (s === 'closed') return 'Stängd'
  return s
}
