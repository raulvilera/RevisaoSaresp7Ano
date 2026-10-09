import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, KeyRound, LogIn, MailCheck } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link } from "wouter";

const EMAIL_PROFESSOR = "vilera@prof.educacao.sp.gov.br";
const FLAG_DEFINIR_SENHA = "saresp7-definir-senha";
const MIN_SENHA = 8;

type Estado = "carregando" | "login" | "criar-senha" | "negado" | "ok";

function Moldura({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen paper flex flex-col">
      <header className="flex items-center gap-3 px-5 py-3 border-b border-ink/10 bg-white/70">
        <Link href="/" className="flex items-center gap-1 text-sm hover:underline"><ArrowLeft size={16} /> Início</Link>
        <h1 className="font-display text-2xl">Área do Professor</h1>
      </header>
      <main className="flex-1 flex items-start justify-center p-5">
        <div className="w-full max-w-md bg-white rounded-3xl shadow p-6 md:p-8 mt-6 space-y-5">{children}</div>
      </main>
    </div>
  );
}

function precisaDefinirSenha(s: Session) {
  return s.user.user_metadata?.senha_definida !== true || localStorage.getItem(FLAG_DEFINIR_SENHA) === "1";
}

export function ProfessorGate({ children }: { children: (sair: () => void, email: string) => ReactNode }) {
  const [estado, setEstado] = useState<Estado>("carregando");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const avaliar = async (s: Session | null) => {
      setSession(s);
      if (!s) return setEstado("login");
      const { data, error } = await supabase!.rpc("sou_professor");
      if (error || data !== true) {
        await supabase!.auth.signOut();
        setSession(null);
        return setEstado("negado");
      }
      setEstado(precisaDefinirSenha(s) ? "criar-senha" : "ok");
    };
    supabase.auth.getSession().then(({ data }) => avaliar(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((evento, s) => {
      if (evento === "INITIAL_SESSION") return;
      // evita chamar o Supabase dentro do próprio callback de autenticação
      setTimeout(() => avaliar(s), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return (
      <Moldura>
        <h2 className="font-display text-2xl">Servidor não configurado</h2>
        <p className="text-sm opacity-80">
          Defina as variáveis <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> e publique novamente.
        </p>
      </Moldura>
    );
  }

  if (estado === "carregando") {
    return <Moldura><p className="text-center opacity-70">Verificando acesso…</p></Moldura>;
  }
  if (estado === "login" || estado === "negado") {
    return <TelaLogin negado={estado === "negado"} />;
  }
  if (estado === "criar-senha") {
    return <TelaCriarSenha onPronto={() => setEstado("ok")} />;
  }
  return <>{children(() => { supabase!.auth.signOut(); }, session?.user.email ?? "")}</>;
}

function TelaLogin({ negado }: { negado: boolean }) {
  const [email, setEmail] = useState(EMAIL_PROFESSOR);
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"senha" | "primeiro">("senha");
  const [enviado, setEnviado] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [msg, setMsg] = useState<string | null>(negado ? "Este e-mail não tem permissão de professor." : null);
  const [ocupado, setOcupado] = useState(false);

  const entrar = async (e: FormEvent) => {
    e.preventDefault();
    setOcupado(true);
    setMsg(null);
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password: senha });
    if (error) setMsg("E-mail ou senha incorretos. No primeiro acesso, use “Primeiro acesso ou esqueci a senha”.");
    setOcupado(false);
  };

  const enviarLink = async (e: FormEvent) => {
    e.preventDefault();
    setOcupado(true);
    setMsg(null);
    localStorage.setItem(FLAG_DEFINIR_SENHA, "1");
    const { error } = await supabase!.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/professor` },
    });
    if (error) {
      localStorage.removeItem(FLAG_DEFINIR_SENHA);
      setMsg("Não foi possível enviar o link. Confira o e-mail ou tente de novo em alguns minutos.");
    } else {
      setEnviado(true);
    }
    setOcupado(false);
  };

  const confirmarCodigo = async (e: FormEvent) => {
    e.preventDefault();
    setOcupado(true);
    setMsg(null);
    const { error } = await supabase!.auth.verifyOtp({ email: email.trim(), token: codigo.trim(), type: "email" });
    if (error) setMsg("Código inválido ou expirado.");
    setOcupado(false);
  };

  return (
    <Moldura>
      {modo === "senha" ? (
        <form onSubmit={entrar} className="space-y-4">
          <h2 className="font-display text-3xl">Entrar</h2>
          <label className="block">
            <div className="label">E-mail</div>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" className="w-full border-2 rounded-xl px-3 py-3" />
          </label>
          <label className="block">
            <div className="label">Senha</div>
            <input type="password" required value={senha} onChange={e => setSenha(e.target.value)} autoComplete="current-password" className="w-full border-2 rounded-xl px-3 py-3" />
          </label>
          {msg && <p role="alert" className="text-sm text-red-700">{msg}</p>}
          <button disabled={ocupado} className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand text-white text-lg font-semibold disabled:opacity-50">
            <LogIn size={20} /> Entrar
          </button>
          <button type="button" onClick={() => { setModo("primeiro"); setMsg(null); }} className="w-full text-sm underline">
            Primeiro acesso ou esqueci a senha
          </button>
        </form>
      ) : !enviado ? (
        <form onSubmit={enviarLink} className="space-y-4">
          <h2 className="font-display text-3xl">Primeiro acesso</h2>
          <p className="text-sm opacity-80">Enviaremos um link ao seu e-mail institucional. Ao abri-lo, você cria a sua senha.</p>
          <label className="block">
            <div className="label">E-mail</div>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border-2 rounded-xl px-3 py-3" />
          </label>
          {msg && <p role="alert" className="text-sm text-red-700">{msg}</p>}
          <button disabled={ocupado} className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand text-white text-lg font-semibold disabled:opacity-50">
            <MailCheck size={20} /> Enviar link
          </button>
          <button type="button" onClick={() => { setModo("senha"); setMsg(null); }} className="w-full text-sm underline">Voltar ao login</button>
        </form>
      ) : (
        <form onSubmit={confirmarCodigo} className="space-y-4">
          <h2 className="font-display text-3xl">Verifique seu e-mail</h2>
          <p className="text-sm opacity-80">Abra o link enviado para <b>{email}</b> neste mesmo navegador. Se o e-mail trouxer um código, digite-o abaixo.</p>
          <input value={codigo} onChange={e => setCodigo(e.target.value)} inputMode="numeric" placeholder="Código (opcional)" className="w-full border-2 rounded-xl px-3 py-3 text-center tracking-widest" />
          {msg && <p role="alert" className="text-sm text-red-700">{msg}</p>}
          <button disabled={ocupado || !codigo.trim()} className="w-full py-3 rounded-full bg-brand text-white text-lg font-semibold disabled:opacity-50">Confirmar código</button>
          <button type="button" onClick={() => { setEnviado(false); setCodigo(""); }} className="w-full text-sm underline">Enviar de novo</button>
        </form>
      )}
    </Moldura>
  );
}

function TelaCriarSenha({ onPronto }: { onPronto: () => void }) {
  const [senha, setSenha] = useState("");
  const [conf, setConf] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (senha.length < MIN_SENHA) return setMsg(`A senha precisa ter pelo menos ${MIN_SENHA} caracteres.`);
    if (senha !== conf) return setMsg("As senhas não coincidem.");
    setOcupado(true);
    setMsg(null);
    const { error } = await supabase!.auth.updateUser({ password: senha, data: { senha_definida: true } });
    if (error) {
      setMsg("Não foi possível salvar a senha. Tente uma senha diferente.");
      setOcupado(false);
      return;
    }
    localStorage.removeItem(FLAG_DEFINIR_SENHA);
    onPronto();
  };

  return (
    <Moldura>
      <form onSubmit={salvar} className="space-y-4">
        <h2 className="font-display text-3xl">Crie sua senha</h2>
        <p className="text-sm opacity-80">Use pelo menos {MIN_SENHA} caracteres. Nos próximos acessos você entrará com e-mail e senha.</p>
        <label className="block">
          <div className="label">Nova senha</div>
          <input type="password" required minLength={MIN_SENHA} value={senha} onChange={e => setSenha(e.target.value)} autoComplete="new-password" className="w-full border-2 rounded-xl px-3 py-3" />
        </label>
        <label className="block">
          <div className="label">Repita a senha</div>
          <input type="password" required value={conf} onChange={e => setConf(e.target.value)} autoComplete="new-password" className="w-full border-2 rounded-xl px-3 py-3" />
        </label>
        {msg && <p role="alert" className="text-sm text-red-700">{msg}</p>}
        <button disabled={ocupado} className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand text-white text-lg font-semibold disabled:opacity-50">
          <KeyRound size={20} /> Salvar senha e entrar
        </button>
      </form>
    </Moldura>
  );
}
