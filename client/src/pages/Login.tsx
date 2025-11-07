import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // Read the response body once. res.json() consumes the stream, so
        // parsing should be attempted from the single text read to avoid
        // "body stream already read" errors.
        let errMsg = res.statusText;
        const txt = await res.text();
        if (txt) {
          try {
            const json = JSON.parse(txt);
            if (json && json.message) errMsg = json.message;
            else errMsg = txt;
          } catch (_e) {
            errMsg = txt;
          }
        }
        throw new Error(errMsg || `${res.status}`);
      }

      // On success, reload to let auth state refresh
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Erro ao iniciar sessão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Iniciar sessão</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'A processar...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
