export default function Loading({ error }) {
  if (error) {
    return (
      <div className="center-screen">
        <p className="error-text">Erro ao carregar dados: {error}</p>
        <p className="error-hint">Verifique as variáveis de ambiente (.env) e as políticas RLS do Supabase.</p>
      </div>
    )
  }
  return (
    <div className="center-screen">
      <div className="spinner" />
      <p className="loading-text">Carregando dados...</p>
    </div>
  )
}
