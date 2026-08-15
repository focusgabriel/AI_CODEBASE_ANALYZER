interface CardProps {
  icon?: string,
  title: string,
  alt?: string,
  content: string,
  msg?: string,
}

const getMessageStyle = (message?: string) => {
  switch (message) {
    case "Excellent":
      return { dot: "bg-emerald-500", text: "text-emerald-700" };
    case "Very Good":
      return { dot: "bg-green-500", text: "text-green-700" };
    case "Good":
      return { dot: "bg-blue-500", text: "text-blue-700" };
    case "Fair":
      return { dot: "bg-amber-500", text: "text-amber-700" };
    case "Needs Improvement":
    case "Below Average":
      return { dot: "bg-orange-500", text: "text-orange-700" };
    case "Poor":
      return { dot: "bg-red-500", text: "text-red-700" };
    default:
      return { dot: "bg-slate-400", text: "text-slate-600" };
  }
};

export const Card = ({icon, title, alt, content, msg}: CardProps) => {
  const messageStyle = getMessageStyle(msg);

  return (
    <section className="group flex min-h-32 w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-inset ring-indigo-100 transition-colors group-hover:bg-indigo-100">
        {icon && (
          <img
            src={icon}
            alt={alt ?? ""}
            className="size-6 object-contain"
          />
        )}
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-medium leading-5 text-slate-500">{title}</h2>
        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{content}</p>
        {msg && (
          <p className={`mt-2 inline-flex items-center gap-1.5 text-sm font-semibold ${messageStyle.text}`}>
            <span
              aria-hidden="true"
              className={`size-2.5 shrink-0 rounded-full ${messageStyle.dot}`}
            />
            {msg}
          </p>
        )}
      </div>
    </section>
  )
}
